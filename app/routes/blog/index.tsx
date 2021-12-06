import * as React from 'react'
import {json, LoaderFunction, useLoaderData} from 'remix'
import {getAllPosts, Post} from '~/utils/posts.server'
import ResponsiveContainer from '~/components/responsive-container'
import BlogPost from '~/components/blog-post'
import {H1, Paragraph} from '~/components/typography'
import {getAllPostViewsCount} from '~/utils/prisma.server'

type LoaderData = {
  posts: Post[]
  totalViewsCount: number
}

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts()
  const sortedPosts = posts.sort((a, b) => {
    const aDate = a.date instanceof Date ? a.date : new Date(a.date)
    const bDate = b.date instanceof Date ? b.date : new Date(b.date)
    return bDate.getTime() - aDate.getTime()
  })

  const totalViewsCount = await getAllPostViewsCount()

  const data: LoaderData = {posts: sortedPosts, totalViewsCount}

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
        {posts.map((post: Post) => (
          <li key={post.slug}>
            <BlogPost post={post} />
          </li>
        ))}
      </ul>
    </ResponsiveContainer>
  )
}
