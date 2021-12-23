import * as React from 'react'
import ResponsiveContainer from './responsive-container'
import Link from './link'
import NowPlaying from './now-playing'
import type {SpotifySong} from '~/types'

export default function Footer({
  nowPlayingSong,
}: {
  nowPlayingSong: SpotifySong | null
}) {
  return (
    <ResponsiveContainer as="footer">
      <hr className="border-1 mb-8 mt-8 w-full border-gray-200 dark:border-gray-800" />

      <NowPlaying song={nowPlayingSong} />

      <div className="grid gap-4 grid-cols-1 pb-16 w-full sm:grid-cols-3">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-6">
            <Link to="/" prefetch="intent">
              Home
            </Link>
          </div>
          <div className="flex flex-col space-y-6">
            <Link to="/blog" prefetch="intent">
              Blog
            </Link>
          </div>
          <div className="flex flex-col space-y-6">
            <Link to="/about" prefetch="intent">
              About
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-6">
            <Link to="https://github.com/abereghici" external>
              Github
            </Link>
          </div>
          <div className="flex flex-col space-y-6">
            <Link to="https://twitter.com/alexandrubrg" external>
              Twitter
            </Link>
          </div>
          <div className="flex flex-col space-y-6">
            <Link to="https://www.linkedin.com/in/alexandrubereghici" external>
              Linkedin
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-6">
            <Link to="mailto:alexandru.brg@gmail.com" external>
              Email
            </Link>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  )
}
