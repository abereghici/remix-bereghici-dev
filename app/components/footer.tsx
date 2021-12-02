import * as React from 'react'
import ResponsiveContainer from './responsive-container'
import Link from './link'

export default function Footer() {
  return (
    <ResponsiveContainer as="footer">
      <hr className="w-full border-1 border-gray-200 dark:border-gray-800 mb-8 mt-8" />
      <div className="w-full grid grid-cols-1 gap-4 pb-16 sm:grid-cols-3">
        <div className="flex flex-col items-center space-y-6">
          <Link to="https://github.com/abereghici" external>
            Github
          </Link>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <Link to="https://twitter.com/alexandrubrg" external>
            Twitter
          </Link>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <Link to="https://www.linkedin.com/in/alexandrubereghici" external>
            Linkedin
          </Link>
        </div>
      </div>
    </ResponsiveContainer>
  )
}
