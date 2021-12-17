import type {MdxPage, MdxListItem, Post, PostViews, PostItem} from '~/types'
import {getMdxPage, getBlogMdxListItems} from './mdx'
import type {Timings} from './metrics.server'
import {prisma} from './prisma.server'

function toPost(page: MdxPage, views: PostViews): Post {
  return {
    ...page,
    views,
  }
}

function toPostItem(page: MdxListItem, views: PostViews): PostItem {
  return {
    ...page,
    views,
  }
}

async function getAllPostViewsCount() {
  try {
    const allViews = await prisma.views.aggregate({
      _sum: {
        count: true,
      },
    })

    return Number(allViews._sum.count)
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    console.log(error)
    return []
  }
}

async function addPostRead(viewId: number | bigint, slug: string) {
  try {
    if (viewId) {
      return await prisma.views.update({
        where: {id: viewId},
        data: {count: {increment: 1}},
      })
    } else {
      return await prisma.views.create({
        data: {
          slug,
          count: 1,
        },
      })
    }
  } catch (error: unknown) {
    console.log(error)
  }
}

async function getAllPosts({
  limit,

  request,
  timings,
}: {
  limit?: number

  request: Request
  timings?: Timings
}): Promise<Array<PostItem>> {
  let posts = await getBlogMdxListItems({
    request,
    timings,
  })

  if (limit) {
    posts = posts.slice(0, limit)
  }

  const postViews = await getPostViewsForSlugs(posts.map(p => p.slug))

  const postsWithViews = posts.map(post => {
    const views = postViews.find(view => view.slug === post.slug)

    return {
      ...toPostItem(
        post,
        views
          ? {id: String(views.id), count: Number(views.count)}
          : {id: undefined, count: 0},
      ),
    }
  })

  return postsWithViews
}

async function getPost({
  slug,
  request,
  timings,
}: {
  slug: string
  request: Request
  timings?: Timings
}): Promise<Post | null> {
  const page = await getMdxPage(
    {
      slug,
      contentDir: 'blog',
    },
    {request, timings},
  )

  if (!page) {
    return null
  }

  const views = await getPostViewsForSlug(slug)

  return toPost(
    page,
    views
      ? {id: String(views.id), count: Number(views.count)}
      : {id: undefined, count: 0},
  )
}

export {
  getAllPosts,
  getPost,
  getPostViewsForSlugs,
  getPostViewsForSlug,
  getAllPostViewsCount,
  addPostRead,
}
