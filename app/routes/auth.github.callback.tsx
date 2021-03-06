import type {LoaderFunction} from '@remix-run/node'
import type {AppHandle} from '~/types'
import {authenticator} from '~/utils/auth.server'
import {getSession} from '~/utils/session.server'

export const handle: AppHandle = {
  getSitemapEntries: () => null,
}

export let loader: LoaderFunction = async ({request}) => {
  let session = await getSession(request)
  const redirectUrl = session.get('redirectUrl') ?? '/'

  return await authenticator.authenticate('github', request, {
    successRedirect: redirectUrl,
    failureRedirect: redirectUrl,
  })
}
