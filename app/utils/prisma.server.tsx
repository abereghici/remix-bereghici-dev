import {PrismaClient, views} from '@prisma/client'
import chalk from 'chalk'
import {getRequiredServerEnvVar} from './misc'

declare global {
  var prisma: ReturnType<typeof getClient> | undefined
}

/**
 * https://github.com/prisma/studio/issues/614
 *
 */
// @ts-expect-error ts(2339)
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
  client.$on('query', (e: {duration: number; query: any}) => {
    if (e.duration < logThreshold) return

    const color =
      e.duration < 30
        ? 'green'
        : e.duration < 50
        ? 'blue'
        : e.duration < 80
        ? 'yellow'
        : e.duration < 100
        ? 'redBright'
        : 'red'
    const dur = chalk[color](`${e.duration}ms`)
    console.log(`prisma:query - ${dur} - ${e.query}`)
  })
  // make the connection eagerly so the first request doesn't have to wait
  void client.$connect()
  return client
}

const prisma =
  global.prisma ?? (global.prisma = getClient(new URL(DATABASE_URL)))

async function getAllPostViewsCount() {
  try {
    const allViews = await prisma.views.aggregate({
      _sum: {
        count: true,
      },
    })

    return Number(allViews._sum.count)
  } catch (error) {
    console.log(error)
    return 0
  }
}

async function getPostViewsForSlug(slug: string) {
  try {
    const postViews = await prisma.views.findFirst({
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return postViews
  } catch (error) {
    console.log(error)
    return 0
  }
}

async function getPostViewsForSlugs(slugs: Array<string>) {
  try {
    const allViews = await prisma.views.findMany({
      select: {
        id: true,
        slug: true,
        count: true,
      },
      where: {
        slug: {
          in: slugs,
        },
      },
    })

    return allViews
  } catch (error) {
    console.log(error)
    return []
  }
}

async function addPostRead(viewId: number | bigint, slug: string) {
  try {
    if (viewId) {
      return prisma.views.update({
        where: {id: viewId},
        data: {count: {increment: 1}},
      })
    } else {
      return prisma.views.create({
        data: {
          slug,
          count: 1,
        },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export {
  prisma,
  getPostViewsForSlugs,
  getPostViewsForSlug,
  getAllPostViewsCount,
  addPostRead,
}
