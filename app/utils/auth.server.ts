import {Authenticator} from 'remix-auth'
import {GitHubStrategy} from 'remix-auth-github'
import {getRequiredServerEnvVar} from '~/utils/misc'
import {sessionStorage} from '~/utils/session.server'
import type {GithubUser} from '~/types'

export let authenticator = new Authenticator<GithubUser>(sessionStorage)

let gitHubStrategy = new GitHubStrategy(
  {
    clientID: getRequiredServerEnvVar('GITHUB_CLIENT_ID'),
    clientSecret: getRequiredServerEnvVar('GITHUB_CLIENT_SECRET'),
    callbackURL: getRequiredServerEnvVar('GITHUB_CALLBACK_URL'),
  },
  async ({profile}) => {
    return {
      id: profile.id,
      displayName: profile.displayName,
      photos: profile.photos,
      name: profile.name,
      admin: profile.id == getRequiredServerEnvVar('GITHUB_ADMIN_ID'),
    }
  },
)

authenticator.use(gitHubStrategy)
