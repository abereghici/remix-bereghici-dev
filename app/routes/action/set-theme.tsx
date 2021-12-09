import * as React from 'react'
import {json, redirect} from 'remix'
import type {ActionFunction} from 'remix'
import {getThemeSession} from '~/utils/theme.server'
import {isTheme} from '~/utils/theme-provider'

export const action: ActionFunction = async ({request}) => {
  const themeSession = await getThemeSession(request)
  const requestText = await request.text()
  const form = new URLSearchParams(requestText)
  const theme = form.get('theme')
  if (!isTheme(theme))
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme.`,
    })

  themeSession.setTheme(theme)
  return json(
    {success: true},
    {
      headers: {'Set-Cookie': await themeSession.commit()},
    },
  )
}

export const loader = () => redirect('/', {status: 404})

export default function MarkRead() {
  return <div>Oops... You should not see this.</div>
}
