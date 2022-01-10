import * as React from 'react'
import Button from './button'
import {H5, Paragraph} from './typography'

type Props = {
  onLogin: () => void
}

export default function BlogPostCommentAuthenticate({onLogin}: Props) {
  return (
    <div className="border border-green-600 rounded p-6 my-6 w-full dark:border-gray-800 bg-green-100 dark:bg-gray-600">
      <H5>You must be logged in to post a comment</H5>
      <Paragraph variant="secondary" size="small" className="my-2">
        Your information is only used to display your name and reply by email.
      </Paragraph>
      <Button type="button" onClick={onLogin}>
        Login
      </Button>
    </div>
  )
}
