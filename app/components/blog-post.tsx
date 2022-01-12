import * as React from 'react'
import {Link} from 'remix'
import {H4, Paragraph} from '~/components/typography'
import Tag from '~/components/tag'
import type {PostItem} from '~/types'

export default function BlogPost({post}: {post: PostItem}) {
  const {slug, views, frontmatter} = post
  const {title, description, categories} = frontmatter
  return (
    <Link to={slug} className="group block mb-10">
      <H4 className="mb-2 group-hover:underline group-focus-within:underline">
        {title}
      </H4>
      <Paragraph variant="secondary" className="mb-4">
        {`${views ? views.toLocaleString() : '–'} views`}
      </Paragraph>
      <div className="flex flex-wrap mb-2">
        {categories.map(category => (
          <Tag key={category} category={category} />
        ))}
      </div>
      <Paragraph variant="secondary">{description}</Paragraph>
    </Link>
  )
}
