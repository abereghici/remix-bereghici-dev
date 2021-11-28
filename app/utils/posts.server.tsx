import type {ReadTimeResults} from 'reading-time'
import {getMdxFile, getMdxFilesFromDir} from './mdx.server'

interface PostFrontMatter {
  title: string
  description: string
  date: Date
  categories: Array<string>
  meta: {
    keywords: Array<string>
  }
  [key: string]: unknown
}

export interface Post extends PostFrontMatter {
  slug: string
  code?: string
  readingTime: string
}

function toPost(post: {
  frontmatter: PostFrontMatter
  slug: string
  readingTime: ReadTimeResults
  code: string
}): Post {
  return {
    ...post.frontmatter,
    slug: post.slug,
    readingTime: post.readingTime.text,
    code: post.code,
  }
}

async function getAllPosts(): Promise<Array<Post>> {
  return (await getMdxFilesFromDir<PostFrontMatter>('blog')).map(toPost)
}

async function getPost(slug: string): Promise<Post> {
  const data = await getMdxFile<PostFrontMatter>('blog', `${slug}.mdx`)
  return toPost(data)
}

export {getAllPosts, getPost}
