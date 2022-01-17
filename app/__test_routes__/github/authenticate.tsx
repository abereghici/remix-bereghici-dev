import {LoaderFunction, redirect} from 'remix'
import type {GithubUser} from '~/types'
import {authenticator} from '~/utils/auth.server'
import {commitSession, getSession} from '~/utils/session.server'

export const loader: LoaderFunction = async ({request}) => {
  const url = new URL(request.url)
  const redirectUrl = url.searchParams.get('redirectUrl') ?? '/'

  const user: GithubUser = {
    id: '1',
    displayName: 'Test User',
    photos: [{value: 'https://avatars0.githubusercontent.com/u/1?v=4'}],
    name: {
      familyName: 'User',
      givenName: 'Test',
      middleName: '',
    },
    admin: true,
  }

  let session = await getSession(request)
  session.set(authenticator.sessionKey, user)
  session.set(authenticator.sessionStrategyKey, 'github')
  session.set(authenticator.sessionErrorKey, null)

  let headers = new Headers({'Set-Cookie': await commitSession(session)})

  return redirect(redirectUrl, {headers})
}

export default () => null
