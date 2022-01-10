import * as React from 'react'
import format from 'date-fns/format'
import type {GithubUser} from '~/types'

type Props = {
  comment: {
    slug: string
    body: string
    createdBy: string
    createdAt: Date
    updatedAt: Date
  }
  user: GithubUser | null
}

export default function BlogPostComment({comment, user}: Props) {
  return (
    <div className="flex flex-col mt-6 mb-6">
      <div className="prose dark:prose-dark w-full">{comment.body}</div>
      <div className="flex items-center space-x-3">
        <p className="text-sm text-gray-500">{comment.createdBy}</p>
        <span className=" text-gray-200 dark:text-gray-800">/</span>
        <p className="text-sm text-gray-400 dark:text-gray-600">
          {format(new Date(comment.updatedAt), "d MMM yyyy 'at' h:mm bb")}
        </p>
        {user && comment.createdBy === user.displayName && (
          <>
            <span className="text-gray-200 dark:text-gray-800">/</span>
            <button className="text-sm text-red-600 dark:text-red-400">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
