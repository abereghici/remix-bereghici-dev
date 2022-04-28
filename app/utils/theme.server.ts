import {createCookieSessionStorage} from '@remix-run/node'
import {createThemeSessionResolver} from 'remix-themes'
import {getRequiredServerEnvVar} from './misc'

export const themeSessionResolver = createThemeSessionResolver(
  createCookieSessionStorage({
    cookie: {
      name: 'bereghici_dev_theme',
      secure: true,
      sameSite: 'lax',
      secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
      path: '/',
      expires: new Date('2100-08-14'),
      httpOnly: true,
    },
  }),
)
