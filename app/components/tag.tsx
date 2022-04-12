import clsx from 'clsx'
import * as React from 'react'

export default function Tag({
  category,
  className,
}: {
  category: string
  className?: string
}) {
  const classes = clsx(
    'text-xs font-bold leading-sm px-2 py-1 bg-blue-200 text-blue-700 rounded-full',
    className,
  )
  return (
    <span key={category} className={classes}>
      #{category}
    </span>
  )
}
