import * as React from 'react'
import {NavLink} from 'remix'
import clsx from 'clsx'

export default function NavigationLink(props: Parameters<typeof NavLink>['0']) {
  return (
    <li>
      <NavLink
        className={({isActive}) =>
          clsx(
            'dark:hover:bg-gray-800 hidden p-1 hover:bg-gray-200 rounded-lg sm:px-3 sm:py-2 md:inline-block',
            {
              'font-semibold text-gray-800 dark:text-gray-200': isActive,
              'font-normal text-gray-600 dark:text-gray-400': !isActive,
            },
          )
        }
        {...props}
      />
    </li>
  )
}
