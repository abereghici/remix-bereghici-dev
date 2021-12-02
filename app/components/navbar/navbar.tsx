import * as React from 'react'
import ResponsiveContainer from '~/components/responsive-container'
import NavLink from './navlink'
import ThemeToggle from './theme-toggle'
import MobileMenu from './mobile-menu'
import SkipNav from './skip-nav'

import LINKS from './links'

export default function NavBar() {
  return (
    <ResponsiveContainer
      as="nav"
      className="flex items-center justify-between pt-8 pb-8 sm:pb-16"
    >
      <SkipNav />
      <div>
        <MobileMenu />
        <ul className="flex items-center -ml-2">
          {LINKS.map(link => (
            <NavLink key={link.name} to={link.to}>
              {link.name}
            </NavLink>
          ))}
        </ul>
      </div>
      <ThemeToggle />
    </ResponsiveContainer>
  )
}
