import * as React from 'react'
import {json, LoaderFunction, useLoaderData} from 'remix'
import {getAllPosts, getAllPostViewsCount} from '~/utils/posts.server'
import {ServerError} from '~/components/errors'
import {H1, Paragraph} from '~/components/typography'
import ResponsiveContainer from '~/components/responsive-container'
import BlogPost from '~/components/blog-post'
import type {PostItem} from '~/types'

type LoaderData = {
  posts: PostItem[]
  totalViewsCount: number
}

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts()
  const totalViewsCount = await getAllPostViewsCount()

  const data: LoaderData = {posts, totalViewsCount}
  return json(data)
}

export default function Index() {
  let {posts, totalViewsCount} = useLoaderData<LoaderData>()

  return (
    <ResponsiveContainer>
      <H1 className="mb-2 w-full tracking-tight">All posts</H1>
      <Paragraph className="mb-10 block" as="em">
        Total views: {totalViewsCount}
      </Paragraph>
      <ul>
        {posts.map((post: PostItem) => (
          <li key={post.slug}>
            <BlogPost post={post} />
          </li>
        ))}
      </ul>
    </ResponsiveContainer>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return <ServerError error={error} />
}
