import * as React from 'react'
import {NavLink} from 'remix'
import clsx from 'clsx'

export default function MenuItem({
  children,
  ...rest
}: Parameters<typeof NavLink>['0']) {
  return (
    <li className="w-full dark:text-gray-100 text-gray-900 text-sm font-semibold border-b border-gray-200 dark:border-gray-600">
      <NavLink
        prefetch="intent"
        className={({isActive}) =>
          clsx('dark:hover:bg-gray-800 flex p-6 w-auto hover:bg-gray-200', {
            'font-semibold text-gray-800 dark:text-gray-200': isActive,
            'font-normal text-gray-600 dark:text-gray-400': !isActive,
          })
        }
        {...rest}
      >
        {children}
      </NavLink>
    </li>
  )
}
