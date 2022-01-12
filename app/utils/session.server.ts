import {createCookieSessionStorage, Session} from 'remix'
import {getRequiredServerEnvVar} from './misc'

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__bereghici.dev_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
    secure: process.env.NODE_ENV === 'production',
  },
})

export function getSession(request: Request): Promise<Session> {
  return sessionStorage.getSession(request.headers.get('Cookie'))
}

export let {commitSession, destroySession} = sessionStorage
