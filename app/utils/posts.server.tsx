import type {MdxPage, MdxListItem, Post, PostViews, PostItem} from '~/types'
import {
  getMdxPage,
  mapFromMdxPageToMdxListItem,
  getMdxPagesInDirectory,
} from './mdx'
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

async function getAllPosts(
  {limit, sortedByDate}: {limit?: number; sortedByDate: boolean} = {
    sortedByDate: true,
    limit: undefined,
  },
): Promise<Array<PostItem>> {
  let posts = await getMdxPagesInDirectory('blog')

  if (sortedByDate) {
    posts = posts.sort((a, b) => {
      const aDate =
        a.frontmatter.date instanceof Date
          ? a.frontmatter.date
          : new Date(a.frontmatter.date)
      const bDate =
        b.frontmatter.date instanceof Date
          ? b.frontmatter.date
          : new Date(b.frontmatter.date)

      return bDate.getTime() - aDate.getTime()
    })
  }

  if (limit) {
    posts = posts.slice(0, limit)
  }

  const postViews = await getPostViewsForSlugs(posts.map(p => p.slug))

  const postsWithViews = posts.map(post => {
    const views = postViews.find(view => view.slug === post.slug)

    return {
      ...toPostItem(
        mapFromMdxPageToMdxListItem(post),
        views
          ? {id: String(views.id), count: Number(views.count)}
          : {id: undefined, count: 0},
      ),
    }
  })

  return postsWithViews
}

async function getPost(slug: string): Promise<Post | null> {
  const page = await getMdxPage({
    slug,
    contentDir: 'blog',
  })

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
