const {performance} = require('perf_hooks')

type Timings = Record<string, Array<{name: string; type: string; time: number}>>

async function time<ReturnType>({
  name,
  type,
  fn,
  timings,
}: {
  name: string
  type: string
  fn: () => ReturnType | Promise<ReturnType>
  timings?: Timings
}): Promise<ReturnType> {
  if (!timings) return fn()

  const start = performance.now()
  const result = await fn()
  type = type.replace(/ /g, '_')
  let timingType = timings[type]
  if (!timingType) {
    timingType = timings[type] = []
  }

  timingType.push({name, type, time: performance.now() - start})
  return result
}

function getServerTimeHeader(timings: Timings) {
  return Object.entries(timings)
    .map(([key, timingInfos]) => {
      const dur = timingInfos
        .reduce((acc, timingInfo) => acc + timingInfo.time, 0)
        .toFixed(1)
      const desc = timingInfos.map(t => t.name).join(' & ')
      return `${key};dur=${dur};desc="${desc}"`
    })
    .join(',')
}

export {time, getServerTimeHeader}
export type {Timings}
