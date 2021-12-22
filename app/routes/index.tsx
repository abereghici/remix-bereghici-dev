import * as React from 'react'
import {json, LoaderFunction, useLoaderData} from 'remix'
import {getAllPosts} from '~/utils/blog.server'

import {getServerTimeHeader, Timings} from '~/utils/metrics.server'
import {getFeaturedGithubContributions} from '~/utils/homepage.server'
import GithubRepoCard from '~/components/github-repo-card'
import ResponsiveContainer from '~/components/responsive-container'
import Hero from '~/components/hero'
import BlogPostCard from '~/components/blog-post-card'
import {H2, H3, Paragraph, Title} from '~/components/typography'
import Link from '~/components/link'
import {ServerError} from '~/components/errors'
import type {GitHubRepo, PostItem} from '~/types'

type LoaderData = {
  posts: PostItem[]
  contributedRepos: GitHubRepo[]
}

export const loader: LoaderFunction = async ({request}) => {
  const timings: Timings = {}

  const [posts, contributedRepos] = await Promise.all([
    getAllPosts({
      limit: 3,
      request,
      timings,
    }),
    getFeaturedGithubContributions({
      request,
      timings,
    }),
  ])

  const data: LoaderData = {posts, contributedRepos}
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
  const {posts, contributedRepos} = useLoaderData<LoaderData>()

  return (
    <ResponsiveContainer>
      <Hero />
      <H2 className="mb-6 tracking-tight">Latest Posts</H2>
      <div className="flex flex-col gap-6">
        {posts.map((post: PostItem, index: number) => (
          <BlogPostCard
            key={post.slug}
            post={post}
            gradient={gradients[index]!}
          />
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

      {contributedRepos.length > 0 ? (
        <>
          <H2 className="mb-5 tracking-tight">GitHub Contributions</H2>
          <ul>
            {contributedRepos.map((repo: GitHubRepo) => (
              <GithubRepoCard key={repo.id} repo={repo} />
            ))}
          </ul>
          <Link
            to="/github-activity"
            className="flex items-center mb-8 mt-8 h-6 leading-7 rounded-lg transition-all"
          >
            View all activity
            <span
              role="img"
              aria-label="read-all-posts"
              className="ml-2 text-2xl"
            >
              👉
            </span>
          </Link>
        </>
      ) : null}
    </ResponsiveContainer>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return <ServerError error={error} />
}
