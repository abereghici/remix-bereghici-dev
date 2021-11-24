import {Link} from 'remix'
import {useLocation} from 'react-router-dom'
import clsx from 'clsx'

import ThemeToggle from './theme-toggle'

const LINKS = [
  {name: 'Home', to: '/'},
  {name: 'Blog', to: '/blog'},
  {name: 'Snippets', to: '/snippets'},
]

function NavLink({
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
          'hidden md:inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all',
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

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between w-full relative max-w-2xl mx-auto pt-8 pb-8 sm:pb-16">
      <ul className="flex">
        {LINKS.map(link => (
          <NavLink key={link.name} to={link.to}>
            {link.name}
          </NavLink>
        ))}
      </ul>
      <ThemeToggle />
    </nav>
  )
}
