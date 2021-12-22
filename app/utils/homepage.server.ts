import {cachified, CachifiedOptions} from './cache.server'
import {getRepositoriesContributedTo} from './github.server'
import {redisCache} from './redis.server'

const defaultMaxAge = 1000 * 60 * 60 * 24 * 1 // 1 day

async function getFeaturedGithubContributions(options?: CachifiedOptions) {
  return cachified({
    cache: redisCache,
    maxAge: defaultMaxAge,
    ...options,
    key: `featured-repositories-contributed-to`,
    checkValue: (value: unknown) => Array.isArray(value),
    getFreshValue: async () => {
      try {
        const featuredRepos = [
          'twilio-labs/paste',
          'justinribeiro/lighthouse-action',
          'remix-run/remix',
          'csstree/csstree',
          'edmundhung/remix-guide',
        ]
        const {contributedRepos} = await getRepositoriesContributedTo()

        return contributedRepos.filter(({name, owner}) =>
          featuredRepos.includes(`${owner.login}/${name}`),
        )
      } catch (e: unknown) {
        console.error(e)
      }

      return []
    },
  })
}

async function getGithubContributions(options?: CachifiedOptions) {
  return cachified({
    cache: redisCache,
    maxAge: defaultMaxAge,
    ...options,
    key: `repositories-contributed-to`,
    checkValue: (value: unknown) => Array.isArray(value),
    getFreshValue: async () => {
      try {
        const {contributedRepos} = await getRepositoriesContributedTo()

        return contributedRepos
      } catch (e: unknown) {
        console.error(e)
      }

      return []
    },
  })
}

export {getFeaturedGithubContributions, getGithubContributions}
