import {createThemeAction} from 'remix-themes'
import {themeSessionResolver} from '~/utils/theme.server'
import type {AppHandle} from '~/types'

export const handle: AppHandle = {
  getSitemapEntries: () => null,
}

export const action = createThemeAction(themeSessionResolver)
