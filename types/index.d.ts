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

export {GitHubFile, AppLoader, AppAction, MdxPage, MdxListItem}
