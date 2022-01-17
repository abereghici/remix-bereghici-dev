import * as React from 'react'
import {useFetcher} from 'remix'
import TextareaAutosize from 'react-textarea-autosize'
import {H5, Paragraph} from './typography'
import Button from './button'

export default function BlogPostCommentInput() {
  const comments = useFetcher()
  const ref = React.useRef<HTMLFormElement>(null)

  const busy = comments.state === 'submitting'

  React.useEffect(() => {
    if (comments.type === 'done' && comments.data.success) {
      ref.current?.reset()
    }
  }, [comments])

  return (
    <div className="border border-green-600 rounded p-6 my-6 w-full dark:border-gray-800 bg-green-100 dark:bg-gray-600">
      <H5>Leave a comment</H5>
      <comments.Form
        ref={ref}
        className="my-4"
        method="post"
        data-testid="comments-form"
      >
        <input hidden name="actionType" defaultValue="createComment" />
        <TextareaAutosize
          aria-label="Your comment"
          placeholder="Your comment..."
          required
          minRows={2}
          name="body"
          className="px-4 py-2 focus:ring-green-500 focus:border-green-500 block w-full border-gray-300 rounded-md bg-white disabled:bg-gray-50 disabled:cursor-not-allowed dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {comments.data?.error ? (
          <Paragraph data-error className="mt-2" variant="danger" size="small">
            {comments.data.error}
          </Paragraph>
        ) : null}
        <Button type="submit" className="ml-auto mt-4" disabled={busy}>
          {busy ? 'Submitting...' : 'Submit'}
        </Button>
      </comments.Form>
    </div>
  )
}
