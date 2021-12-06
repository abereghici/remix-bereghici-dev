import type {ReadTimeResults} from 'reading-time'
import {getMdxFile, getMdxFilesFromDir} from './mdx.server'
import {getAllPostViews, getPostViewsForSlug} from './prisma.server'

interface PostViews {
  id?: string
  count: number
}
interface PostFrontMatter {
  title: string
  description: string
  date: Date | string
  categories: Array<string>
  meta: {
    keywords: Array<string>
  }
  [key: string]: unknown
}

export interface Post extends PostFrontMatter {
  slug: string
  code: string
  readingTime: ReadTimeResults
  views: PostViews
}

function toPost(
  post: {
    frontmatter: PostFrontMatter
    slug: string
    readingTime: ReadTimeResults
    code: string
  },
  views: PostViews,
): Post {
  return {
    ...post.frontmatter,
    slug: post.slug,
    readingTime: post.readingTime,
    code: post.code,
    views,
  }
}

async function getAllPosts(): Promise<Array<Post>> {
  const [posts, postViews] = await Promise.all([
    getMdxFilesFromDir<PostFrontMatter>('blog'),
    getAllPostViews(),
  ])

  const postsWithViews = posts.map(post => {
    const views = postViews.find(view => view.slug === post.slug)

    return {
      ...toPost(
        post,
        views
          ? {id: String(views.id), count: Number(views.count)}
          : {id: undefined, count: 0},
      ),
    }
  })

  return postsWithViews
}

async function getPost(slug: string): Promise<Post> {
  const [post, views] = await Promise.all([
    getMdxFile<PostFrontMatter>('blog', `${slug}.mdx`),
    getPostViewsForSlug(slug),
  ])

  return toPost(
    post,
    views
      ? {id: String(views.id), count: Number(views.count)}
      : {id: undefined, count: 0},
  )
}

export {getAllPosts, getPost}
