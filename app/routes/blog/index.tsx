import * as React from 'react'
import {json, LoaderFunction, useLoaderData} from 'remix'
import {getAllPosts, Post} from '~/utils/posts.server'
import ResponsiveContainer from '~/components/responsive-container'
import BlogPost from '~/components/blog-post'
import {H1} from '~/components/typography'

type LoaderData = {
  posts: Post[]
}

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts()
  const sortedPosts = posts.sort((a, b) => {
    const aDate = a.date instanceof Date ? a.date : new Date(a.date)
    const bDate = b.date instanceof Date ? b.date : new Date(b.date)
    return bDate.getTime() - aDate.getTime()
  })

  const data: LoaderData = {posts: sortedPosts}

  return json(data, {
    headers: {
      'Cache-Control': 'private, max-age=3600',
      Vary: 'Cookie',
    },
  })
}

export default function Index() {
  let {posts} = useLoaderData<LoaderData>()

  return (
    <ResponsiveContainer>
      <H1 className="mb-10 w-full tracking-tight">All posts</H1>
      <ul>
        {posts.map((post: Post) => (
          <li key={post.slug}>
            <BlogPost
              slug={post.slug}
              title={post.title}
              description={post.description}
            />
          </li>
        ))}
      </ul>
    </ResponsiveContainer>
  )
}
