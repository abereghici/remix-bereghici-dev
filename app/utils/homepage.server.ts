import {cachified, CachifiedOptions} from './cache.server'
import {getRepositoriesContributedTo} from './github.server'
import {redisCache} from './redis.server'

const defaultMaxAge = 1000 * 60 * 60 * 24 * 1 // 1 day

const repositoriesContributedToKey = `repositories-contributed-to`

async function getGithubContributions(options?: CachifiedOptions) {
  return cachified({
    cache: redisCache,
    maxAge: defaultMaxAge,
    ...options,
    key: repositoriesContributedToKey,
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

export {getGithubContributions}
