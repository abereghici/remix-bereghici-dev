import * as React from 'react'
import clsx from 'clsx'
import {Link as RemixLink, LinkProps} from 'remix'

type Props = LinkProps & {
  external?: boolean
}

export default function Link({external, className, to, ...rest}: Props) {
  const classes = clsx(
    'text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-500 transition',
    className,
  )

  const href = typeof to === 'string' ? to : to?.pathname

  if (external) {
    return (
      <a
        {...rest}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      />
    )
  }

  return <RemixLink {...rest} to={to} className={classes} />
}
