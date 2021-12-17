import * as React from 'react'
import {Link,useLocation} from 'remix'
import clsx from 'clsx'

export default function NavLink({
  to,
  ...rest
}: Omit<Parameters<typeof Link>['0'], 'to'> & {to: string}) {
  const location = useLocation()
  const isSelected =
    to === location.pathname || location.pathname.startsWith(`${to}/`)

  return (
    <li>
      <Link
        prefetch="intent"
        className={clsx(
          'dark:hover:bg-gray-800 hidden p-1 hover:bg-gray-200 rounded-lg sm:px-3 sm:py-2 md:inline-block',
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
