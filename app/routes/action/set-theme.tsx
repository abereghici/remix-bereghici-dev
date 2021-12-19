import * as React from 'react'
import {redirect} from 'remix'
import {createThemeAction} from 'remix-themes'
import {themeSessionResolver} from '~/utils/theme.server'
import type {AppHandle} from '~/types'

export const handle: AppHandle = {
  getSitemapEntries: () => null,
}

export const action = createThemeAction(themeSessionResolver)

export const loader = () => redirect('/', {status: 404})

export default function MarkRead() {
  return <div>Oops... You should not see this.</div>
}
