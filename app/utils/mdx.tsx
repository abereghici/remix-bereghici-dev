import * as React from 'react'
import * as mdxBundler from 'mdx-bundler/client'
import {compileMdx} from '~/utils/compile-mdx.server'
import {redisCache} from '~/utils/redis.server'
import {getUrl, typedBoolean} from '~/utils/misc'
import {getImageBuilder, getImgProps} from '~/utils/images'
import {
  downloadDirList,
  downloadMdxFileOrDirectory,
} from '~/utils/github.server'
import {cachified, CachifiedOptions} from '~/utils/cache.server'
import {getSocialMetas} from '~/utils/seo'

import type {LoaderData as RootLoaderData} from '../root'

import type {GitHubFile, MdxListItem, MdxPage} from '~/types'

const defaultMaxAge = 1000 * 60 * 60 * 24 * 30

const getCompiledKey = (contentDir: string, slug: string) =>
  `${contentDir}:${slug}:compiled`
const getDownloadKey = (contentDir: string, slug: string) =>
  `${contentDir}:${slug}:downloaded`
const getDirListKey = (contentDir: string) => `${contentDir}:dir-list`

const checkCompiledValue = (value: unknown) =>
  typeof value === 'object' &&
  (value === null || ('code' in value && 'frontmatter' in value))

async function getMdxPage(
  {
    contentDir,
    slug,
  }: {
    contentDir: string
    slug: string
  },
  options: CachifiedOptions,
): Promise<MdxPage | null> {
  const key = getCompiledKey(contentDir, slug)
  const page = await cachified({
    cache: redisCache,
    maxAge: defaultMaxAge,
    ...options,
    // reusing the same key as compiledMdxCached because we just return that
    // exact same value. Cachifying this allows us to skip getting the cached files
    key,
    checkValue: checkCompiledValue,
    getFreshValue: async () => {
      const pageFiles = await downloadMdxFilesCached(contentDir, slug, options)
      const compiledPage = await compileMdxCached({
        contentDir,
        slug,
        ...pageFiles,
        options,
      }).catch(err => {
        console.error(`Failed to get a fresh value for mdx:`, {
          contentDir,
          slug,
        })
        return Promise.reject(err)
      })
      return compiledPage
    },
  })
  if (!page) {
    // if there's no page, let's remove it from the cache
    void redisCache.del(key)
  }
  return page
}

async function compileMdxCached({
  contentDir,
  slug,
  entry,
  files,
  options,
}: {
  contentDir: string
  slug: string
  entry: string
  files: Array<GitHubFile>
  options: CachifiedOptions
}) {
  const key = getCompiledKey(contentDir, slug)
  const page = await cachified({
    cache: redisCache,
    maxAge: defaultMaxAge,
    ...options,
    key,
    checkValue: checkCompiledValue,
    getFreshValue: async () => {
      const compiledPage = await compileMdx<MdxPage['frontmatter']>(slug, files)
      if (compiledPage) {
        return {
          ...compiledPage,
          slug,
          editLink: `https://github.com/abereghici/remix-bereghici-dev/edit/main/${entry}`,
        }
      } else {
        return null
      }
    },
  })
  // if there's no page, remove it from the cache
  if (!page) {
    void redisCache.del(key)
  }
  return page
}

async function downloadMdxFilesCached(
  contentDir: string,
  slug: string,
  options: CachifiedOptions,
) {
  const key = getDownloadKey(contentDir, slug)
  const downloaded = await cachified({
    cache: redisCache,
    maxAge: defaultMaxAge,
    ...options,
    key,
    checkValue: (value: unknown) => {
      if (typeof value !== 'object') {
        return `value is not an object`
      }
      if (value === null) {
        return `value is null`
      }

      const download = value as Record<string, unknown>
      if (!Array.isArray(download.files)) {
        return `value.files is not an array`
      }
      if (typeof download.entry !== 'string') {
        return `value.entry is not a string`
      }

      return true
    },
    getFreshValue: async () =>
      downloadMdxFileOrDirectory(`${contentDir}/${slug}`),
  })
  // if there aren't any files, remove it from the cache
  if (!downloaded.files.length) {
    void redisCache.del(key)
  }
  return downloaded
}

async function getMdxDirList(contentDir: string, options?: CachifiedOptions) {
  return cachified({
    cache: redisCache,
    maxAge: defaultMaxAge,
    ...options,
    key: getDirListKey(contentDir),
    checkValue: (value: unknown) => Array.isArray(value),
    getFreshValue: async () => {
      const fullContentDirPath = `content/${contentDir}`
      const dirList = (await downloadDirList(fullContentDirPath))
        .map(({name, path}) => ({
          name,
          slug: path
            .replace(`${fullContentDirPath}/`, '')
            .replace(/\.mdx$/, ''),
        }))
        .filter(({name}) => name !== 'README.md')
      return dirList
    },
  })
}

async function getMdxPagesInDirectory(
  contentDir: string,
  options: CachifiedOptions,
) {
  const dirList = await getMdxDirList(contentDir, options)

  // our octokit throttle plugin will make sure we don't hit the rate limit
  const pageDatas = await Promise.all(
    dirList.map(async ({slug}) => {
      return {
        ...(await downloadMdxFilesCached(contentDir, slug, options)),
        slug,
      }
    }),
  )

  const pages = await Promise.all(
    pageDatas.map(pageData =>
      compileMdxCached({contentDir, ...pageData, options}),
    ),
  )
  return pages.filter(typedBoolean)
}

async function getBlogMdxListItems(options: CachifiedOptions) {
  return cachified({
    cache: redisCache,
    maxAge: defaultMaxAge,
    ...options,
    key: 'blog:mdx-list-items',
    getFreshValue: async () => {
      let pages = await getMdxPagesInDirectory('blog', options)

      pages = pages.sort((a, b) => {
        const aDate =
          a.frontmatter.date instanceof Date
            ? a.frontmatter.date
            : new Date(a.frontmatter.date)
        const bDate =
          b.frontmatter.date instanceof Date
            ? b.frontmatter.date
            : new Date(b.frontmatter.date)

        return bDate.getTime() - aDate.getTime()
      })

      return pages.map(mapFromMdxPageToMdxListItem)
    },
  })
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
    // eslint-disable-next-line jsx-a11y/alt-text
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

function mdxPageMeta({
  data,
  parentsData,
}: {
  data: {page: MdxPage | null} | null
  parentsData: {root: RootLoaderData}
}) {
  const {requestInfo} = parentsData.root
  if (data?.page) {
    const {keywords = [], ...extraMeta} = data.page.frontmatter.meta
    let title = data.page.frontmatter.title
    const isDraft = data.page.frontmatter.draft
    if (isDraft) title = `(DRAFT) ${title}`

    return {
      ...(isDraft ? {robots: 'noindex'} : null),
      ...getSocialMetas({
        title,
        description: data.page.frontmatter.description,
        keywords: keywords.join(', '),
        url: getUrl(requestInfo),
        image:
          data.page.frontmatter.bannerCloudinaryId ??
          'bereghici-dev/blog/avatar_bwdhvv',
      }),
      ...extraMeta,
    }
  } else {
    return {
      title: 'Not found',
      description: 'You landed on a page that could not be find 😢',
    }
  }
}

export {
  getMdxPage,
  mapFromMdxPageToMdxListItem,
  getMdxPagesInDirectory,
  getMdxDirList,
  getBlogMdxListItems,
  getMdxComponent,
  useMdxComponent,
  getCompiledKey,
  getDownloadKey,
  getDirListKey,
  mdxPageMeta,
}
