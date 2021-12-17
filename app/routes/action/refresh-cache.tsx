import path from 'path'
import * as React from 'react'
import {json, redirect} from 'remix'
import type {ActionFunction} from 'remix'
import {getRequiredServerEnvVar} from '~/utils/misc'
import {redisCache} from '~/utils/redis.server'
import {getMdxPagesInDirectory, getMdxDirList, getMdxPage} from '~/utils/mdx'
import type {AppHandle} from '~/types'

type Body =
  | {keys: Array<string>; commitSha?: string}
  | {contentPaths: Array<string>; commitSha?: string}

export const commitShaKey = 'meta:last-refresh-commit-sha'

export const handle: AppHandle = {
  getSitemapEntries: () => null,
}

export const action: ActionFunction = async ({request}) => {
  // Everything in this function is fire and forget, so we don't need to await
  // anything.

  if (
    request.headers.get('auth') !==
    getRequiredServerEnvVar('REFRESH_CACHE_SECRET')
  ) {
    return redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  }

  const body = (await request.json()) as Body

  function setShaInRedis() {
    if (body.commitSha) {
      void redisCache.set(
        commitShaKey,
        JSON.stringify({sha: body.commitSha, date: new Date()}),
      )
    }
  }

  if ('keys' in body && Array.isArray(body.keys)) {
    for (const key of body.keys) {
      void redisCache.del(key)
    }

    setShaInRedis()

    return json({
      message: 'Deleting redis cache keys',
      keys: body.keys,
      commitSha: body.commitSha,
    })
  }
  if ('contentPaths' in body && Array.isArray(body.contentPaths)) {
    const refreshingContentPaths = []
    for (const contentPath of body.contentPaths) {
      if (typeof contentPath !== 'string') continue

      if (contentPath.startsWith('blog') || contentPath.startsWith('pages')) {
        const [contentDir, dirOrFilename] = contentPath.split('/')
        if (!contentDir || !dirOrFilename) continue
        const slug = path.parse(dirOrFilename).name

        refreshingContentPaths.push(contentPath)
        void getMdxPage({contentDir, slug}, {forceFresh: true})
      }
    }

    // if any blog contentPaths were changed then let's update the dir list
    // so it will appear on the blog page.
    if (refreshingContentPaths.some(p => p.startsWith('blog'))) {
      void getMdxPagesInDirectory('blog', {
        request,
        forceFresh: 'blog:dir-list,blog:mdx-list-items',
      })
    }
    if (refreshingContentPaths.some(p => p.startsWith('pages'))) {
      void getMdxDirList('pages', {forceFresh: true})
    }

    setShaInRedis()

    return json({
      message: 'Refreshing cache for content paths',
      contentPaths: refreshingContentPaths,
      commitSha: body.commitSha,
    })
  }
  return json({message: 'no action taken'}, {status: 400})
}

export const loader = () => redirect('/', {status: 404})

export default function MarkRead() {
  return <div>Oops... You should not see this.</div>
}
