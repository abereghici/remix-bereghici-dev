import * as React from 'react'
import clsx from 'clsx'

export default function MenuToggle({
  state,
  onToggle,
}: {
  state: 'opened' | 'closed'
  onToggle: () => void
}) {
  return (
    <button
      className="flex items-center justify-center -ml-2 w-9 h-9 rounded-lg visible transition-shadow hover:ring-2 ring-gray-300 md:hidden"
      aria-label="Toggle menu"
      type="button"
      onClick={onToggle}
    >
      <MenuIcon hidden={state === 'opened'} />
      <CloseIcon hidden={state === 'closed'} />
    </button>
  )
}

function MenuIcon({
  hidden,
  ...props
}: JSX.IntrinsicElements['svg'] & {hidden: boolean}) {
  return (
    <svg
      className={clsx('absolute w-5 h-5 dark:text-gray-100 text-gray-900', {
        hidden,
      })}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M2.5 7.5H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 12.5H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon({
  hidden,
  ...props
}: JSX.IntrinsicElements['svg'] & {hidden: boolean}) {
  return (
    <svg
      className={clsx('absolute w-5 h-5 dark:text-gray-100 text-gray-900', {
        hidden,
      })}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      {...props}
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}
