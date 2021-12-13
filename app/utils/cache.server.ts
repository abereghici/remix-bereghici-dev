import formatDuration from 'date-fns/formatDuration'
import intervalToDuration from 'date-fns/intervalToDuration'
const {performance} = require('perf_hooks')
import {time, Timings} from '~/utils/metrics.server'

function niceFormatDuration(milliseconds: number) {
  const duration = intervalToDuration({start: 0, end: milliseconds})
  const formatted = formatDuration(duration, {delimiter: ', '})
  const ms = milliseconds % 1000
  return [formatted, ms ? `${ms.toFixed(3)}ms` : null]
    .filter(Boolean)
    .join(', ')
}

type CacheMetadata = {
  createdTime: number
  maxAge: number | null
}

function shouldRefresh(metadata: CacheMetadata) {
  if (metadata.maxAge) {
    return Date.now() > metadata.createdTime + metadata.maxAge
  }
  return false
}

// it's the value/null/undefined or a promise that resolves to that
type VNUP<Value> = Value | null | undefined | Promise<Value | null | undefined>

const keysRefreshing = new Set()

async function cachified<
  Value,
  Cache extends {
    name: string
    get: (key: string) => VNUP<{
      metadata: CacheMetadata
      value: Value
    }>
    set: (
      key: string,
      value: {
        metadata: CacheMetadata
        value: Value
      },
    ) => unknown | Promise<unknown>
    del: (key: string) => unknown | Promise<unknown>
  },
>(options: {
  key: string
  cache: Cache
  getFreshValue: () => Promise<Value>
  checkValue?: (value: Value) => boolean | string
  forceFresh?: boolean | string
  request?: Request
  fallbackToCache?: boolean
  timings?: Timings
  timingType?: string
  maxAge?: number
}): Promise<Value> {
  const {
    key,
    cache,
    getFreshValue,
    request,
    checkValue = value => Boolean(value),
    fallbackToCache = true,
    timings,
    timingType = 'getting fresh value',
    maxAge,
  } = options

  // if forceFresh is a string, we'll only force fresh if the key is in the
  // comma separated list. Otherwise we'll go with it's value and fallback
  // to the shouldForceFresh function on the request if the request is provided
  // otherwise it's false.
  const forceFresh =
    typeof options.forceFresh === 'string'
      ? options.forceFresh.split(',').includes(key)
      : options.forceFresh ??
        (request ? await shouldForceFresh(request, key) : false)

  function assertCacheEntry(entry: unknown): asserts entry is {
    metadata: CacheMetadata
    value: Value
  } {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error(
        `Cache entry for ${key} is not a cache entry object, it's a ${typeof entry}`,
      )
    }
    if (!('metadata' in entry)) {
      throw new Error(
        `Cache entry for ${key} does not have a metadata property`,
      )
    }
    if (!('value' in entry)) {
      throw new Error(`Cache entry for ${key} does not have a value property`)
    }
  }

  if (!forceFresh) {
    try {
      const cached = await time({
        name: `cache.get(${key})`,
        type: 'cache read',
        fn: () => cache.get(key),
        timings,
      })
      if (cached) {
        assertCacheEntry(cached)

        if (shouldRefresh(cached.metadata)) {
          // time to refresh the value. Fire and forget so we don't slow down
          // this request
          // we use setTimeout here to make sure this happens on the next tick
          // of the event loop so we don't end up slowing this request down in the
          // event the cache is synchronous (unlikely now, but if the code is changed
          // then it's quite possible this could happen and it would be easy to
          // forget to check).
          // In practice we have had a handful of situations where multiple
          // requests triggered a refresh of the same resource, so that's what
          // the keysRefreshing thing is for to ensure we don't refresh a
          // value if it's already in the process of being refreshed.
          if (!keysRefreshing.has(key)) {
            keysRefreshing.add(key)
            setTimeout(() => {
              // eslint-disable-next-line prefer-object-spread
              void cachified(Object.assign({}, options, {forceFresh: true}))
                .catch(() => {})
                .finally(() => {
                  keysRefreshing.delete(key)
                })
            }, 200)
          }
        }
        const valueCheck = checkValue(cached.value)
        if (valueCheck === true) {
          return cached.value
        } else {
          const reason = typeof valueCheck === 'string' ? valueCheck : 'unknown'
          console.warn(
            `check failed for cached value of ${key}\nReason: ${reason}.\nDeleting the cache key and trying to get a fresh value.`,
            cached,
          )
          await cache.del(key)
        }
      }
    } catch (error: unknown) {
      console.error(
        `error with cache at ${key}. Deleting the cache key and trying to get a fresh value.`,
        error,
      )
      await cache.del(key)
    }
  }

  const start = performance.now()
  const value = await time({
    name: `getFreshValue for ${key}`,
    type: timingType,
    fn: getFreshValue,
    timings,
  }).catch((error: unknown) => {
    console.error(
      `getting a fresh value for ${key} failed`,
      {fallbackToCache, forceFresh},
      error,
    )
    // If we got this far without forceFresh then we know there's nothing
    // in the cache so no need to bother trying again without a forceFresh.
    // So we need both the option to fallback and the ability to fallback.
    if (fallbackToCache && forceFresh) {
      return cachified({...options, forceFresh: false})
    } else {
      throw error
    }
  })
  const totalTime = performance.now() - start

  const valueCheck = checkValue(value)
  if (valueCheck === true) {
    const metadata: CacheMetadata = {
      maxAge: maxAge ?? null,
      createdTime: Date.now(),
    }
    try {
      console.log(
        `Updating the cache value for ${key}.`,
        `Getting a fresh value for this took ${niceFormatDuration(totalTime)}.`,
        `Caching for a minimum of ${
          typeof maxAge === 'number'
            ? `${niceFormatDuration(maxAge)}`
            : 'forever'
        } in ${cache.name}.`,
      )
      await cache.set(key, {metadata, value})
    } catch (error: unknown) {
      console.error(`error setting cache: ${key}`, error)
    }
  } else {
    const reason = typeof valueCheck === 'string' ? valueCheck : 'unknown'
    console.error(
      `check failed for cached value of ${key}\nReason: ${reason}.\nDeleting the cache key and trying to get a fresh value.`,
      value,
    )
    throw new Error(`check failed for fresh value of ${key}`)
  }
  return value
}

async function shouldForceFresh(request: Request, key: string) {
  const fresh = new URL(request.url).searchParams.get('fresh')
  if (typeof fresh !== 'string') return false
  if (fresh === '') return true

  return fresh.split(',').includes(key)
}

export {cachified}
