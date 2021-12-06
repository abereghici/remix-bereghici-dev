import redis from 'redis'
import {getRequiredServerEnvVar} from './misc'

declare global {
  // This prevents us from making multiple connections to the db when the
  // require cache is cleared.
  var redis: redis.RedisClient | undefined
}

const REDIS_URL = getRequiredServerEnvVar('REDIS_URL')

const getClient = (options: redis.ClientOpts): redis.RedisClient => {
  const url = new URL(options.url ?? '')
  const client = redis.createClient(options)

  client.on('error', (error: string) => {
    console.error(`REDIS (${url.host}) ERROR:`, error)
  })

  return client
}

const client = global.redis ?? (global.redis = getClient({url: REDIS_URL}))

// NOTE: Caching should never crash the app, so instead of rejecting all these
// promises, we'll just resolve things with null and log the error.

function get<Value = unknown>(key: string): Promise<Value | null> {
  return new Promise(resolve => {
    client.get(key, (err: Error | null, result: string | null) => {
      if (err) {
        console.error(`REDIS ERROR with .get:`, err)
      }
      resolve(result ? (JSON.parse(result) as Value) : null)
    })
  })
}

function set<Value>(key: string, value: Value): Promise<'OK'> {
  return new Promise(resolve => {
    client.set(key, JSON.stringify(value), (err: Error | null, reply: 'OK') => {
      if (err) console.error(`REDIS ERROR with .set:`, err)
      resolve(reply)
    })
  })
}

function del(key: string): Promise<string> {
  return new Promise(resolve => {
    client.del(key, (err: Error | null, result: number | null) => {
      if (err) {
        console.error(`REDIS ERROR with .del:`, err)
        resolve('error')
      } else {
        resolve(`${key} deleted: ${result}`)
      }
    })
  })
}

const redisCache = {get, set, del, name: 'redis'}
export {get, set, del, redisCache}
