import path from 'path'
import * as React from 'react'
import {ActionFunction, json, redirect} from 'remix'
import {
  getMdxPage,
  getMdxPagesInDirectory,
  getCompiledKey,
  getDownloadKey,
  getDirListKey,
} from '~/utils/mdx'
import {redisCache} from '~/utils/redis.server'

type Body = {keys: Array<string>} | {contentPaths: Array<string>}

export const action: ActionFunction = async ({request}) => {
  const body = (await request.json()) as Body

  if ('keys' in body && Array.isArray(body.keys)) {
    for (const key of body.keys) {
      void redisCache.del(key)
    }

    return json({
      message: 'Deleting redis cache keys',
      keys: body.keys,
    })
  }

  if ('contentPaths' in body && Array.isArray(body.contentPaths)) {
    const refreshingContentPaths = []
    for (const contentPath of body.contentPaths) {
      if (typeof contentPath !== 'string') continue

      if (contentPath.startsWith('blog')) {
        const [contentDir, dirOrFilename] = contentPath.split('/')
        if (!contentDir || !dirOrFilename) continue
        const slug = path.parse(dirOrFilename).name

        refreshingContentPaths.push(contentPath)

        await redisCache.del(getDownloadKey(contentDir, slug))
        await redisCache.del(getCompiledKey(contentDir, slug))
        void getMdxPage({contentDir, slug})
      }
    }

    // if any blog contentPaths were changed then let's update the dir list
    // so it will appear on the blog page.
    if (refreshingContentPaths.some(p => p.startsWith('blog'))) {
      await redisCache.del(getDirListKey('blog'))
      void getMdxPagesInDirectory('blog')
    }

    return json({
      message: 'Refreshing cache for content paths',
      contentPaths: refreshingContentPaths,
    })
  }
  return json({message: 'no action taken'}, {status: 400})
}

export const loader = () => redirect('/', {status: 404})

export default function MarkRead() {
  return <div>Oops... You should not see this.</div>
}
