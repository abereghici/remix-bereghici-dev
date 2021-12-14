/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import type {ActionFunction, LoaderFunction} from 'remix'
import calculateReadingTime from 'reading-time'

type GitHubFile = {path: string; content: string}

type MdxPage = {
  code: string
  slug: string
  readTime?: ReturnType<typeof calculateReadingTime>
  editLink: string
  frontmatter: {
    title: string
    description: string
    date: string | Date
    draft?: boolean
    categories: Array<string>
    bannerCloudinaryId?: string
    meta: {
      keywords: Array<string>
      [key: string]: unknown
    }
  }
}

interface PostViews {
  id?: string
  count: number
}

interface Post extends MdxPage {
  views: PostViews
}

interface PostItem extends MdxListItem {
  views: PostViews
}

type MdxListItem = Omit<MdxPage, 'code'>

type AppLoader<
  Params extends Record<string, unknown> = Record<string, unknown>,
> = (
  args: Omit<Parameters<LoaderFunction>['0'], 'params'> & {params: Params},
) => ReturnType<LoaderFunction>

type AppAction<
  Params extends Record<string, unknown> = Record<string, unknown>,
> = (
  args: Omit<Parameters<ActionFunction>['0'], 'params'> & {params: Params},
) => ReturnType<ActionFunction>

type AppSitemapEntry = {
  route: string
  lastmod?: string
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
}

type AppHandle = {
  /** this just allows us to identify routes more directly rather than relying on pathnames */
  id?: string
  getSitemapEntries?: (
    request: Request,
  ) =>
    | Promise<Array<AppSitemapEntry | null> | null>
    | Array<AppSitemapEntry | null>
    | null
  scroll?: false
}

export {
  GitHubFile,
  AppLoader,
  AppAction,
  MdxPage,
  MdxListItem,
  Post,
  PostItem,
  PostViews,
  AppSitemapEntry,
  AppHandle,
}
