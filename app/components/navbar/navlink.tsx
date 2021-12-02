import * as React from 'react'
import {Link} from 'remix'
import {useLocation} from 'remix'
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
          'hidden md:inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800',
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
