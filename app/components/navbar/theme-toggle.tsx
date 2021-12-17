import * as React from 'react'
import {useTheme, Theme} from '~/utils/theme-provider'

export const useLoaded = () => {
  const [loaded, setLoaded] = React.useState(false)
  React.useEffect(() => setLoaded(true), [])
  return loaded
}

export default function ThemeToggle() {
  const [theme, setTheme] = useTheme()

  const loaded = useLoaded()

  return (
    <button
      aria-label="Toggle Theme"
      type="button"
      className="flex items-center justify-center w-9 h-9 bg-gray-200 dark:bg-gray-600 rounded-lg transition hover:ring-2 ring-gray-300"
      onClick={() => setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)}
    >
      {theme === Theme.DARK && loaded && <SunIcon />}
      {theme === Theme.LIGHT && loaded && <MoonIcon />}
    </button>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="animate-fade-in-stroke w-5 h-5 dark:text-gray-200 text-gray-800"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="animate-fade-in-stroke w-5 h-5 dark:text-gray-200 text-gray-800"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
      )
    </svg>
  )
}
