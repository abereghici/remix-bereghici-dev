import * as React from 'react'
import type {GitHubRepo} from '~/types'
import Link from './link'
import {Paragraph} from './typography'

export default function GithubRepoCard({repo}: {repo: GitHubRepo}) {
  const {name, description, owner} = repo
  return (
    <Link
      to={repo.url}
      external
      className="group block -mx-4 my-4 p-4 rounded-md"
    >
      <div className="text-blue-400 group-hover:underline group-focus-within:underline">
        <span className="text-blue-600 dark:text-blue-300">{owner.login}/</span>
        <span className="text-blue-600 dark:text-blue-300">{name}</span>
      </div>
      {description && <Paragraph variant="secondary">{description}</Paragraph>}
    </Link>
  )
}
