import * as React from 'react'
import clsx from 'clsx'
import {Link as RemixLink, LinkProps} from 'remix'

type Props = LinkProps & {
  external?: boolean
}

export default function Link({
  external,
  className,
  to,
  children,
  ...rest
}: Props) {
  const classes = clsx(
    'dark:hover:text-gray-500 dark:text-gray-400 hover:text-gray-500 text-gray-600 transition',
    className,
  )

  const href = typeof to === 'string' ? to : to.pathname

  if (external) {
    return (
      <a
        {...rest}
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={classes}
      >
        {children}
      </a>
    )
  }

  return (
    <RemixLink {...rest} to={to} className={classes}>
      {children}
    </RemixLink>
  )
}
