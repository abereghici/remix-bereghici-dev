import * as React from 'react'

export default function Tag({category}: {category: string}) {
  return (
    <span
      key={category}
      className="mr-4 text-xs font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
    >
      #{category}
    </span>
  )
}
