import * as React from 'react'
import {json, LoaderFunction, useLoaderData} from 'remix'
import {motion} from 'framer-motion'
import {getAllPosts, getAllPostViewsCount} from '~/utils/blog.server'
import {ServerError} from '~/components/errors'
import {H1, Paragraph} from '~/components/typography'
import ResponsiveContainer from '~/components/responsive-container'
import BlogPost from '~/components/blog-post'
import type {PostItem} from '~/types'
import {getServerTimeHeader, Timings} from '~/utils/metrics.server'

type LoaderData = {
  posts: PostItem[]
  totalViewsCount: number
}

export const loader: LoaderFunction = async ({request}) => {
  const timings: Timings = {}

  const posts = await getAllPosts({request, timings})
  const totalViewsCount = await getAllPostViewsCount()

  const data: LoaderData = {posts, totalViewsCount}
  return json(data, {
    headers: {
      'Server-Timing': getServerTimeHeader(timings),
    },
  })
}

export default function Index() {
  const {posts, totalViewsCount} = useLoaderData<LoaderData>()

  return (
    <ResponsiveContainer>
      <H1 className="mb-2 w-full tracking-tight">All posts</H1>
      <Paragraph className="block mb-10" as="em">
        Total views: {totalViewsCount}
      </Paragraph>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {posts.map((post: PostItem) => (
          <motion.li
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.99}}
            key={post.slug}
            className="w-full"
          >
            <BlogPost post={post} />
          </motion.li>
        ))}
      </ul>
    </ResponsiveContainer>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return <ServerError error={error} />
}
