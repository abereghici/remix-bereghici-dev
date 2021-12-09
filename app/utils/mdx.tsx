import * as React from 'react'
import * as mdxBundler from 'mdx-bundler/client'
import {compileMdx} from '~/utils/compile-mdx.server'
import {redisCache} from '~/utils/redis.server'
import {typedBoolean} from '~/utils/misc'
import {getImageBuilder, getImgProps} from '~/utils/images'
import {
  downloadDirList,
  downloadMdxFileOrDirectory,
} from '~/utils/github.server'
import type {GitHubFile, MdxListItem, MdxPage} from '~/types'

const getCompiledKey = (contentDir: string, slug: string) =>
  `${contentDir}:${slug}:compiled`
const getDownloadKey = (contentDir: string, slug: string) =>
  `${contentDir}:${slug}:downloaded`
const getDirListKey = (contentDir: string) => `${contentDir}:dir-list`

async function getMdxPage({
  contentDir,
  slug,
}: {
  contentDir: string
  slug: string
}): Promise<MdxPage | null> {
  const key = getCompiledKey(contentDir, slug)

  const cached = await redisCache.get<MdxPage>(key)

  if (cached) {
    return cached
  }

  const pageFiles = await downloadMdxFilesCached(contentDir, slug)

  const compiledPage = await compileMdxCached({
    contentDir,
    slug,
    ...pageFiles,
  }).catch((err: unknown) => {
    console.error(`Failed to get a fresh value for mdx:`, {
      contentDir,
      slug,
    })
    return Promise.reject(err)
  })

  if (compiledPage) {
    void redisCache.set(key, compiledPage)
  } else {
    void redisCache.del(key)
  }

  return compiledPage
}

async function compileMdxCached({
  contentDir,
  slug,
  files,
  entry,
}: {
  contentDir: string
  slug: string
  entry: string
  files: Array<GitHubFile>
}): Promise<MdxPage | null> {
  const key = getCompiledKey(contentDir, slug)
  const cached = await redisCache.get<MdxPage>(key)

  if (cached) {
    return cached
  }

  const compiledPage = await compileMdx<MdxPage['frontmatter']>(slug, files)

  if (compiledPage) {
    return {
      ...compiledPage,
      slug,
      editLink: `https://github.com/abereghici/remix-bereghici-dev/edit/main/${entry}`,
    }
  } else {
    void redisCache.del(key)
    return null
  }
}

async function downloadMdxFilesCached(
  contentDir: string,
  slug: string,
): Promise<{
  entry: string
  files: GitHubFile[]
}> {
  const key = getDownloadKey(contentDir, slug)

  const cached = await redisCache.get<
    Promise<{
      entry: string
      files: GitHubFile[]
    }>
  >(key)

  if (cached) {
    return cached
  }

  const downloaded = await downloadMdxFileOrDirectory(`${contentDir}/${slug}`)

  if (downloaded.files.length) {
    void redisCache.set(key, downloaded)
  } else {
    void redisCache.del(key)
  }

  return downloaded
}

async function getMdxDirList(contentDir: string) {
  const fullContentDirPath = `content/${contentDir}`
  const dirList = (await downloadDirList(fullContentDirPath))
    .map(({name, path}) => ({
      name,
      slug: path.replace(`${fullContentDirPath}/`, '').replace(/\.mdx$/, ''),
    }))
    .filter(({name}) => name !== 'README.md')

  return dirList
}

async function getMdxPagesInDirectory(contentDir: string) {
  const key = getDirListKey(contentDir)

  const cached = await redisCache.get<
    {
      name: string
      slug: string
    }[]
  >(key)

  if (cached) {
    return cached
  }

  const dirList = await getMdxDirList(contentDir)

  // our octokit throttle plugin will make sure we don't hit the rate limit
  const pageDatas = await Promise.all(
    dirList.map(async ({slug}) => {
      return {
        ...(await downloadMdxFilesCached(contentDir, slug)),
        slug,
      }
    }),
  )

  const pages = (
    await Promise.all(
      pageDatas.map(pageData => compileMdxCached({contentDir, ...pageData})),
    )
  ).filter(typedBoolean)

  void redisCache.set(key, pages)

  return pages
}

/**
 * This is useful for when you don't want to send all the code for a page to the client.
 */
function mapFromMdxPageToMdxListItem(page: MdxPage): MdxListItem {
  const {code, ...mdxListItem} = page
  return mdxListItem
}

function Image({
  cloudinaryId,
  imgProps,
}: {
  cloudinaryId: string
  imgProps: JSX.IntrinsicElements['img']
}) {
  return (
    <img
      className="my-8 w-full rounded-lg object-cover"
      {...getImgProps(getImageBuilder(cloudinaryId, imgProps.alt), {
        widths: [480, 768],
        sizes: ['(max-width: 767px) 100vw', '768px'],
        transformations: {background: 'rgb:e6e9ee'},
      })}
      {...imgProps}
    />
  )
}

const mdxComponents = {
  Image,
}

function getMdxComponent(code: string) {
  const Component = mdxBundler.getMDXComponent(code)
  function MdxComponent({
    components,
    ...rest
  }: Parameters<typeof Component>['0']) {
    return (
      <Component components={{...mdxComponents, ...components}} {...rest} />
    )
  }
  return MdxComponent
}

function useMdxComponent(code: string) {
  return React.useMemo(() => getMdxComponent(code), [code])
}

export {
  getMdxPage,
  mapFromMdxPageToMdxListItem,
  getMdxPagesInDirectory,
  getMdxComponent,
  useMdxComponent,
  getCompiledKey,
  getDownloadKey,
  getDirListKey,
}
