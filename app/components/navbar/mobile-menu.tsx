import * as React from 'react'
import clsx from 'clsx'
import ResponsiveContainer from '~/components/responsive-container'

import MenuItem from './menu-item'
import MenuToggle from './menu-toggle'
import LINKS from './links'

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  function toggleMenu() {
    setIsMenuOpen(prev => !prev)
  }

  function close() {
    setIsMenuOpen(false)
  }

  React.useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches && isMenuOpen) {
        close()
      }
    }

    const mql: MediaQueryList = window.matchMedia('(min-width: 768px)')
    mql.addEventListener('change', handler)

    return function cleanup() {
      mql.removeEventListener('change', handler)
    }
  }, [isMenuOpen])

  return (
    <>
      <MenuToggle
        state={isMenuOpen ? 'opened' : 'closed'}
        onToggle={toggleMenu}
      />
      {isMenuOpen && (
        <ResponsiveContainer
          as="ul"
          className={clsx(
            'md:hidden fixed w-full h-screen left-0 mt-2 bg-gray-100 dark:bg-gray-900 z-10',
          )}
        >
          {LINKS.map(({to, name}) => (
            <MenuItem key={to} to={to} onClick={close}>
              {name}
            </MenuItem>
          ))}
        </ResponsiveContainer>
      )}
    </>
  )
}
