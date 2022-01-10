import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {H5} from './typography'
import type {GithubUser} from '~/types'
import Button from './button'

type Props = {
  action: string
}

export default function BlogPostCommentInput({action}: Props) {
  return (
    <div className="border border-green-600 rounded p-6 my-6 w-full dark:border-gray-800 bg-green-100 dark:bg-gray-600">
      <H5>Leave a comment</H5>
      <form className="my-4" action={action} method="POST">
        <TextareaAutosize
          aria-label="Your comment"
          placeholder="Your comment..."
          required
          minRows={1}
          className="px-4 py-2 focus:ring-green-500 focus:border-green-500 block w-full border-gray-300 rounded-md bg-white disabled:bg-gray-50 disabled:cursor-not-allowed dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <Button type="submit" className="ml-auto mt-4">
          Send
        </Button>
      </form>
    </div>
  )
}
