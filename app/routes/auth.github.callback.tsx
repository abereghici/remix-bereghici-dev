import {LoaderFunction, redirect} from 'remix'
import {authenticator} from '~/utils/auth.server'
import {commitSession, getSession} from '~/utils/session.server'

export let loader: LoaderFunction = async ({request}) => {
  let session = await getSession(request)
  const redirectUrl = session.get('redirectUrl') ?? '/'

  try {
    return await authenticator.authenticate('github', request, {
      successRedirect: redirectUrl,
      throwOnError: true,
    })
  } catch (error: unknown) {
    console.error(error)
    let message = `Failed to authenticate with GitHub.`

    session.set(authenticator.sessionErrorKey, message)
    return redirect(redirectUrl, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  }
}
