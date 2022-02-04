import * as React from 'react'
import clsx from 'clsx'
import {Link} from 'remix'
import {Paragraph, Title} from './typography'
import type {PostItem} from '~/types'

export default function BlogPostCard({
  gradient,
  post,
}: {
  post: PostItem
  gradient: string
}) {
  const {frontmatter, slug, views} = post
  const {title, description} = frontmatter
  return (
    <Link
      prefetch="intent"
      to={`/blog/${slug}`}
      className={clsx('p-1 w-full bg-gradient-to-r rounded-xl block', gradient)}
    >
      <div className="bg-primary flex flex-col justify-between p-4 h-full rounded-lg">
        <Title as="h3" size="h6" className="mb-2 w-full tracking-tight">
          {title}
        </Title>
        <Paragraph size="small" variant="secondary" className="mb-4 sm:mb-6">
          {description}
        </Paragraph>
        <div className="text-secondary capsize flex items-center">
          <span role="img" aria-label="views icon" className="text-2xl">
            👀
          </span>
          <span className="capsize align-baseline ml-2">
            {views ? views.toLocaleString() : '–'}
          </span>
        </div>
      </div>
    </Link>
  )
}
