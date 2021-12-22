import * as React from 'react'

import type {SpotifySong} from '~/types'
import Link from './link'
import {Paragraph} from './typography'

export default function TrackItem({
  item,
  index,
}: {
  item: SpotifySong
  index: number
}) {
  return (
    <div
      key={item.songUrl}
      className="flex flex-row items-start border-b border-gray-200 last:border-0 dark:border-gray-800 mt-8"
    >
      <Paragraph variant="secondary" className="text-sm font-bold">
        {index + 1}
      </Paragraph>
      <div className="flex flex-col sm:flex-row">
        <div className="w-[40px] flex-shrink-0 ml-3 mb-3 sm:mb-0">
          <img
            alt={item.title}
            height={40}
            width={40}
            src={item.albumImageUrl}
            className="rounded-full ring-4 ring-gray-200"
          />
        </div>
        <div className="pl-3">
          <Link external className="font-medium" to={item.songUrl}>
            {item.title}
          </Link>
          <Paragraph variant="secondary" className="mb-4">
            {item.artist}
          </Paragraph>
        </div>
      </div>
    </div>
  )
}
