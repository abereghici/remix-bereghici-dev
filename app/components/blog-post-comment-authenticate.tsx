import * as React from 'react'
import {Form, useTransition} from '@remix-run/react'
import Button from './button'
import {H5, Paragraph} from './typography'

type Props = {
  error: string | null
}

export default function BlogPostCommentAuthenticate({error}: Props) {
  const authentication = useTransition()

  const submitting = authentication.state === 'submitting'

  return (
    <Form
      method="post"
      className="border border-green-600 rounded p-6 my-6 w-full dark:border-gray-800 bg-green-100 dark:bg-gray-600"
    >
      <H5>You must be logged in to post a comment</H5>
      <Paragraph variant="secondary" size="small" className="my-2">
        Your information is only used to display your name and reply by email.
      </Paragraph>
      <input hidden name="actionType" defaultValue="authenticate" />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Logging in...' : 'Log in'}
      </Button>

      {error ? (
        <Paragraph data-error className="mt-2" variant="danger" size="small">
          {error}
        </Paragraph>
      ) : null}
    </Form>
  )
}
