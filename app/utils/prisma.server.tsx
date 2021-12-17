import {PrismaClient} from '@prisma/client'
import {getRequiredServerEnvVar} from './misc'

declare global {
  // eslint-disable-next-line no-var,vars-on-top
  var prisma: ReturnType<typeof getClient> | undefined
}

/**
 * https://github.com/prisma/studio/issues/614
 *
 */
// @ts-expect-error ts(2339)
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function toJSON() {
  return Number(this)
}

const DATABASE_URL = getRequiredServerEnvVar('DATABASE_URL')

const logThreshold = 50

function getClient(connectionUrl: URL): PrismaClient {
  console.log(`Setting up prisma client to ${connectionUrl.host}`)
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is.
  const client = new PrismaClient({
    log: [
      {level: 'query', emit: 'event'},
      {level: 'error', emit: 'stdout'},
      {level: 'info', emit: 'stdout'},
      {level: 'warn', emit: 'stdout'},
    ],
    datasources: {
      db: {
        url: connectionUrl.toString(),
      },
    },
  })
  client.$on('query', (e: {duration: number; query: unknown}) => {
    if (e.duration < logThreshold) return

    const dur = `${e.duration}ms`
    console.log(`prisma:query - ${dur} - ${e.query}`)
  })
  // make the connection eagerly so the first request doesn't have to wait
  void client.$connect()
  return client
}

const prisma =
  global.prisma ?? (global.prisma = getClient(new URL(DATABASE_URL)))

export {prisma}
