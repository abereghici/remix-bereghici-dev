import * as React from 'react'
import {Link} from 'remix'
import type {Post} from '~/utils/posts.server'
import {H4, Paragraph} from '~/components/typography'

export default function BlogPost({post}: {post: Post}) {
  const {title, description, slug, views} = post
  return (
    <Link to={slug} className="block mb-10 group">
      <H4 className="mb-2 group-hover:underline group-focus-within:underline">
        {title}
      </H4>
      <Paragraph variant="secondary" className="mb-4">
        {`${
          views.count ? new Number(views.count).toLocaleString() : '–'
        } views`}
      </Paragraph>
      <Paragraph variant="secondary">{description}</Paragraph>
    </Link>
  )
}
