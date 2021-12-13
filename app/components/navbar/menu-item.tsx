import * as React from 'react'
import {Link, useLocation} from 'remix'
import clsx from 'clsx'

export default function MenuItem({
  to,
  ...rest
}: Omit<Parameters<typeof Link>['0'], 'to'> & {to: string}) {
  const location = useLocation()
  const isSelected =
    to === location.pathname || location.pathname.startsWith(`${to}/`)

  return (
    <li className="border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm font-semibold w-full">
      <Link
        prefetch="intent"
        className={clsx(
          'flex w-auto p-6 hover:bg-gray-200 dark:hover:bg-gray-800',
          {
            'font-semibold text-gray-800 dark:text-gray-200': isSelected,
            'font-normal text-gray-600 dark:text-gray-400': !isSelected,
          },
        )}
        to={to}
        {...rest}
      />
    </li>
  )
}
