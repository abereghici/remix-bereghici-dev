import type {Post as PrismaPost} from '@prisma/client'
import type {MdxPage, MdxListItem, Post, PostItem, GithubUser} from '~/types'
import {getMdxPage, getBlogMdxListItems} from './mdx'
import type {Timings} from './metrics.server'
import {typedBoolean} from './misc'
import {prisma} from './prisma.server'

function toPost(page: MdxPage, post: PrismaPost): Post {
  return {
    ...page,
    ...post,
  }
}

function toPostItem(page: MdxListItem, post: PrismaPost): PostItem {
  return {
    ...page,
    ...post,
  }
}

async function getAllPostViewsCount() {
  try {
    const allViews = await prisma.post.aggregate({
      _sum: {
        views: true,
      },
    })

    return Number(allViews._sum.views)
  } catch (error: unknown) {
    console.log(error)
    return 0
  }
}

async function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
    include: {
      comments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

async function getPostsBySlugs(slugs: Array<string>) {
  try {
    return prisma.post.findMany({
      where: {
        slug: {
          in: slugs,
        },
      },
    })
  } catch (error: unknown) {
    console.log(error)
    return []
  }
}

async function addPostRead(slug: string) {
  try {
    return await prisma.post.upsert({
      where: {slug},
      create: {
        slug,
        views: 1,
      },
      update: {
        views: {
          increment: 1,
        },
      },
    })
  } catch (error: unknown) {
    console.error(error)
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

  const dbPosts = await getPostsBySlugs(posts.map(p => p.slug))

  const postsWithViews = posts
    .map(async post => {
      const currentDbPost =
        dbPosts.find(view => view.slug === post.slug) ||
        (await createPost(post.slug))

      return {
        ...toPostItem(post, currentDbPost),
      }
    })
    .filter(typedBoolean)

  return Promise.all(postsWithViews)
}

async function createPost(slug: string) {
  return prisma.post.create({
    data: {
      slug,
      views: 0,
    },
  })
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

  const post = (await getPostBySlug(slug)) || (await createPost(slug))

  return toPost(page, post)
}

async function createPostComment({
  postId,
  body,
  user,
}: {
  body: string
  postId: string
  user: GithubUser
}) {
  const authorName = user.name.givenName ?? user.displayName

  return prisma.comment.create({
    data: {
      body,
      authorName,
      authorAvatarUrl: user.photos?.[0]?.value,
      postId,
    },
  })
}

async function deletePostComment(commentId: string) {
  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  })
}

export {
  getAllPosts,
  getPost,
  createPost,
  getPostsBySlugs,
  getPostBySlug,
  getAllPostViewsCount,
  addPostRead,
  createPostComment,
  deletePostComment,
}
