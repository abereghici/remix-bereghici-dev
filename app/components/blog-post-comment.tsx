import * as React from 'react'
import format from 'date-fns/format'
import type {GithubUser, Comment} from '~/types'
import {useFetcher} from 'remix'
import {Paragraph} from './typography'

type Props = {
  comment: Comment
  user: GithubUser | null
}

export default function BlogPostComment({comment, user}: Props) {
  const commentFetcher = useFetcher()

  const busy = commentFetcher.state === 'submitting'

  const deleteComment = () => {
    commentFetcher.submit(
      {
        actionType: 'deleteComment',
        commentId: comment.id,
      },
      {method: 'post'},
    )
  }

  return (
    <div className="flex flex-col mt-6 mb-6">
      <Paragraph className="w-full mb-2">{comment.body}</Paragraph>
      <div className="flex items-center space-x-3">
        {comment.authorAvatarUrl && (
          <img
            alt="User avatar"
            height={24}
            width={24}
            src={comment.authorAvatarUrl}
            className="rounded-full"
          />
        )}
        <Paragraph variant="secondary">{comment.authorName}</Paragraph>
        <span className="text-gray-300 dark:text-gray-200">/</span>
        <Paragraph size="small">
          {format(new Date(comment.updatedAt), "d MMM yyyy 'at' h:mm bb")}
        </Paragraph>
        {user && user.admin && (
          <>
            <span className="text-gray-300 dark:text-gray-200">/</span>
            <button
              className="text-sm text-primary underline"
              onClick={deleteComment}
              disabled={busy}
            >
              {busy ? 'Deleting...' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
