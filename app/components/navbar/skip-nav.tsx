import * as React from 'react'

export default function SkipNav() {
  return (
    <a
      href="#main"
      className="text-primary bg-primary fixed z-10 -top-8 left-2 focus:top-4 px-4 py-3 transform -translate-y-12 focus:translate-y-3 transition-transform duration-200"
    >
      Skip to content
    </a>
  )
}
