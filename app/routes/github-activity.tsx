import * as React from 'react'
import type {LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {getGithubContributions} from '~/utils/homepage.server'
import type {Timings} from '~/utils/metrics.server'
import {getServerTimeHeader} from '~/utils/metrics.server'
import {ServerError} from '~/components/errors'
import {H1} from '~/components/typography'
import ResponsiveContainer from '~/components/responsive-container'
import GithubRepoCard from '~/components/github-repo-card'
import Link from '~/components/link'
import type {GitHubRepo} from '~/types'

type LoaderData = {
  repos: GitHubRepo[]
}

export const loader: LoaderFunction = async ({request}) => {
  const timings: Timings = {}

  const repos = await getGithubContributions({
    request,
    timings,
  })
  const data: LoaderData = {repos}
  return json(data, {
    headers: {
      'Server-Timing': getServerTimeHeader(timings),
    },
  })
}

export default function Index() {
  const {repos} = useLoaderData<LoaderData>()

  return (
    <ResponsiveContainer>
      <H1 className="mb-2 w-full tracking-tight">GitHub Contributions</H1>

      <ul>
        {repos.map((repo: GitHubRepo) => (
          <GithubRepoCard key={repo.id} repo={repo} />
        ))}
      </ul>

      <Link
        external
        to="https://github.com/abereghici?tab=repositories"
        className="flex items-center mb-8 mt-8 h-6 leading-7 rounded-lg transition-all"
      >
        View on <span className="ml-1 font-semibold">GitHub</span>
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
