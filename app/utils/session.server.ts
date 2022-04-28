import type {Session} from '@remix-run/node'
import {createCookieSessionStorage} from '@remix-run/node'
import {getRequiredServerEnvVar} from './misc'

const sessionExpirationTime = 1000 * 60 * 60 * 24 * 365 // 1 year

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__bereghici.dev_session',
    secure: true,
    secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
    sameSite: 'lax',
    path: '/',
    maxAge: sessionExpirationTime / 1000,
    httpOnly: true,
  },
})

export function getSession(request: Request): Promise<Session> {
  return sessionStorage.getSession(request.headers.get('Cookie'))
}

export let {commitSession, destroySession} = sessionStorage
