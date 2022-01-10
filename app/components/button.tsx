import * as React from 'react'

type Props = JSX.IntrinsicElements['button']

const classes =
  'flex items-center justify-center  font-medium h-8 bg-green-600 hover:bg-green-500 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-100 rounded w-28'

export default function Button({children, className, ...rest}: Props) {
  return (
    <button className={`${classes} ${className || ''}`} {...rest}>
      {children}
    </button>
  )
}
