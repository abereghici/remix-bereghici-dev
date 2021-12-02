import * as React from 'react'

export default function SkipNav() {
  return (
    <a
      href="#main"
      className="bg-gray-100 dark:bg-gray-900 fixed z-10 px-4 py-3 transition-transform duration-200 transform -translate-y-12 left-2 focus:top-4 focus:translate-y-3 -top-8"
    >
      Skip to content
    </a>
  )
}
