import * as React from 'react'
import {json, LinksFunction, useCatch, useFetcher, useLoaderData} from 'remix'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import {mdxPageMeta, useMdxComponent, getBlogMdxListItems} from '~/utils/mdx'
import {getPost, addPostRead} from '~/utils/blog.server'
import {authenticator} from '~/utils/auth.server'
import {commitSession, getSession} from '~/utils/session.server'
import {getServerTimeHeader, Timings} from '~/utils/metrics.server'
import ResponsiveContainer from '~/components/responsive-container'
import {H1, H2, Paragraph} from '~/components/typography'
import {FourOhFour, ServerError} from '~/components/errors'
import useOnRead from '~/components/use-on-read'
import type {AppAction, AppHandle, AppLoader, GithubUser, Post} from '~/types'
import codeHighlightStyles from '~/styles/code-highlight.css'
import BlogPostCommentInput from '~/components/blog-post-comment-input'
import BlogPostComment from '~/components/blog-post-comment'
import BlogPostCommentAuthenticate from '~/components/blog-post-comment-authenticate'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: codeHighlightStyles}]
}

export const meta = mdxPageMeta

type LoaderData = {
  page: Post
  user: GithubUser | null
}

const handleId = 'blog-post'
export const handle: AppHandle = {
  id: handleId,
  getSitemapEntries: async request => {
    const pages = await getBlogMdxListItems({request})
    return pages
      .filter(page => !page.frontmatter.draft)
      .map(page => {
        return {route: `/blog/${page.slug}`, priority: 0.7}
      })
  },
}

const markPostAsRead = async (slug: string, request: Request) => {
  const post = await getPost({
    slug,
    request,
  })

  if (!post) {
    return json({success: false})
  }

  const viewId = Number(post.views.id)
  await addPostRead(isNaN(viewId) ? 0 : viewId, slug)

  return json({success: true})
}

const authenticate = async (request: Request) => {
  let session = await getSession(request)
  session.set('redirectUrl', request.url)

  request.headers.set('Cookie', await commitSession(session))
  return authenticator.authenticate('github', request)
}

const logout = async (request: Request) => {
  await authenticator.logout(request, {redirectTo: request.url})
}

export const action: AppAction<{slug: string}> = async ({request, params}) => {
  const type = (await request.formData()).get('actionType')

  switch (type) {
    case 'markRead': {
      return markPostAsRead(params.slug, request)
    }
    case 'authenticate': {
      return authenticate(request)
    }

    case 'logout': {
      return logout(request)
    }

    default:
      throw new Error('Unknown action type')
  }
}

export const loader: AppLoader<{slug: string}> = async ({request, params}) => {
  const timings: Timings = {}

  let user = await authenticator.isAuthenticated(request)

  const {slug} = params
  const post = await getPost({
    slug,
    request,
    timings,
  })

  const headers = {
    'Server-Timing': getServerTimeHeader(timings),
  }

  if (!post) {
    throw new Response('Not Found', {status: 404, headers})
  }

  const data: LoaderData = {page: post, user}

  return json(data, {
    headers,
  })
}

export default function FullArticle() {
  const {page, user} = useLoaderData<LoaderData>()
  const {frontmatter, readTime, code, views} = page
  const {title, date, draft} = frontmatter

  const Component = useMdxComponent(code)

  const readMarker = React.useRef<HTMLDivElement>(null)

  const fetcher = useFetcher()
  const fetcherRef = React.useRef(fetcher)
  React.useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  useOnRead({
    parentElRef: readMarker,
    time: readTime?.time,
    onRead: React.useCallback(() => {
      if (draft) return
      fetcherRef.current.submit({actionType: 'markRead'}, {method: 'post'})
    }, [draft]),
  })

  const authenticate = React.useCallback(() => {
    fetcherRef.current.submit({actionType: 'authenticate'}, {method: 'post'})
  }, [])

  return (
    <ResponsiveContainer>
      <H1 className="mb-4 tracking-tight">{title}</H1>
      <div className="flex flex-col items-start justify-between mt-2 w-full md:flex-row md:items-center">
        <div className="flex items-center">
          <img
            alt="Alexandru Bereghici"
            height={24}
            width={24}
            src="/avatar.jpeg"
            className="rounded-full"
          />
          <Paragraph className="ml-2" size="small">
            {'Alexandru Bereghici / '}
            {format(
              date instanceof Date ? date : parseISO(date),
              'MMMM dd, yyyy',
            )}
          </Paragraph>
        </div>
        <Paragraph size="small" className="t min-w-32 mt-2 md:mt-0">
          {readTime?.text}
          {` • `}
          {views.count} views
        </Paragraph>
      </div>
      <div ref={readMarker} className="prose dark:prose-dark mt-9">
        <Component />
      </div>
      <H2 className="my-4 tracking-tight">Discussion</H2>
      {user ? (
        <BlogPostCommentInput action="/" />
      ) : (
        <BlogPostCommentAuthenticate onLogin={authenticate} />
      )}
      <BlogPostComment
        user={user}
        comment={{
          slug: page.slug,
          body: "What a beautiful and useful website! I'm inspired by the Snippets section. I would like to build it for myself. 😁",
          createdBy: 'Zain Fathoni',
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />
      <BlogPostComment
        user={user}
        comment={{
          slug: page.slug,
          body: "What a beautiful and useful website! I'm inspired by the Snippets section. I would like to build it for myself. 😁",
          createdBy: 'Zain Fathoni',
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />
    </ResponsiveContainer>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  console.error('CatchBoundary', caught)
  if (caught.status === 404) {
    return <FourOhFour />
  }
  throw new Error(`Unhandled error: ${caught.status}`)
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return <ServerError error={error} />
}
