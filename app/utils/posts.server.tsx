import type {MdxPage, MdxListItem} from '~/types'
import {
  getMdxPage,
  mapFromMdxPageToMdxListItem,
  getMdxPagesInDirectory,
} from './mdx'
import {getPostViewsForSlugs, getPostViewsForSlug} from './prisma.server'

interface PostViews {
  id?: string
  count: number
}

export interface Post extends MdxPage {
  views: PostViews
}

export interface PostItem extends MdxListItem {
  views: PostViews
}

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

export {getAllPosts, getPost}
