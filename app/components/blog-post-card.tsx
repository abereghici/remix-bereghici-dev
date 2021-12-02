import * as React from 'react'
import clsx from 'clsx'
import {Link} from 'remix'
import {H6, Paragraph} from './typography'

export default function BlogPostCard({
  title,
  description,
  slug,
  gradient,
  views,
}: {
  title: string
  description: string
  slug: string
  gradient: string
  views: number
}) {
  return (
    <Link
      prefetch="intent"
      to={`/blog/${slug}`}
      className={clsx(
        'transform hover:scale-[1.01] transition-all',
        'rounded-xl w-full bg-gradient-to-r p-1',
        gradient,
      )}
    >
      <div className="flex flex-col justify-between h-full bg-primary rounded-lg p-4">
        <H6 className="mb-2 w-full tracking-tight">{title}</H6>
        <Paragraph size="small" variant="secondary" className="mb-6 sm:mb-10">
          {description}
        </Paragraph>
        <div className="flex items-center text-secondary capsize">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="ml-2 align-baseline capsize">
            {views ? new Number(views).toLocaleString() : '–'}
          </span>
        </div>
      </div>
    </Link>
  )
}
