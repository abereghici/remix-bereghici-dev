import type {LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {motion} from 'framer-motion'
import {getAllPosts} from '~/utils/blog.server'

import type {Timings} from '~/utils/metrics.server'
import {getServerTimeHeader} from '~/utils/metrics.server'
import ResponsiveContainer from '~/components/responsive-container'
import Hero from '~/components/hero'
import BlogPostCard from '~/components/blog-post-card'
import {H2} from '~/components/typography'
import Link from '~/components/link'
import {ServerError} from '~/components/errors'
import type {PostItem} from '~/types'

type LoaderData = {
  posts: PostItem[]
}

export const loader: LoaderFunction = async ({request}) => {
  const timings: Timings = {}

  const posts = await getAllPosts({
    limit: 3,
    request,
    timings,
  })

  const data: LoaderData = {posts}
  return json(data, {
    headers: {
      'Server-Timing': getServerTimeHeader(timings),
    },
  })
}

const gradients = [
  'from-[#D8B4FE] to-[#818CF8]',
  'from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]',
  'from-[#FDE68A] via-[#FCA5A5] to-[#FECACA]',
]

export default function IndexRoute() {
  const {posts} = useLoaderData() as unknown as LoaderData

  return (
    <ResponsiveContainer>
      <Hero />
      <H2 className="mb-6 tracking-tight">Latest Posts</H2>
      <div className="flex flex-col gap-6">
        {posts.map((post, index) => (
          <motion.div
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.99}}
            key={post.slug}
            className="w-full"
          >
            <BlogPostCard post={post} gradient={gradients[index]!} />
          </motion.div>
        ))}
      </div>
      <Link
        to="/blog"
        className="flex items-center mb-8 mt-8 h-6 leading-7 rounded-lg transition-all"
      >
        Read all posts
        <span role="img" aria-label="read-all-posts" className="ml-2 text-2xl">
          👉
        </span>
      </Link>
    </ResponsiveContainer>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return <ServerError error={error} />
}
