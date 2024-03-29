import * as React from 'react'
import {json} from '@remix-run/node'
import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {
  Links,
  Meta,
  Scripts,
  Outlet,
  LiveReload,
  useLoaderData,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react'
import type {LinksFunction} from '@remix-run/node'
import type {Theme} from 'remix-themes'
import {ThemeProvider, useTheme, PreventFlashOnWrongTheme} from 'remix-themes'
import {getDomainUrl, getDisplayUrl} from '~/utils/misc'
import type {Timings} from '~/utils/metrics.server'
import {getServerTimeHeader} from '~/utils/metrics.server'
import {getSocialMetas} from './utils/seo'
import {getEnv} from '~/utils/env.server'
import {themeSessionResolver} from './utils/theme.server'
import {getNowPlaying} from '~/utils/spotify.server'
import {pathedRoutes} from '~/other-routes.server'
import Navbar from '~/components/navbar'
import Footer from '~/components/footer'
import {FourOhFour, ServerError} from '~/components/errors'
import type {SpotifySong} from '~/types'

import tailwindStyles from './styles/tailwind.css'
import proseStyles from './styles/prose.css'
import globalStyles from './styles/global.css'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/ibm-plex-sans-var.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/ibm-plex-sans-var-italic.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {rel: 'icon', href: '/favicon.ico'},
    {rel: 'preload', as: 'style', href: tailwindStyles},
    {rel: 'preload', as: 'style', href: proseStyles},
    {rel: 'preload', as: 'style', href: globalStyles},
    {rel: 'stylesheet', href: tailwindStyles},
    {rel: 'stylesheet', href: proseStyles},
    {rel: 'stylesheet', href: globalStyles},
  ]
}

export const meta: MetaFunction = ({data}) => {
  const requestInfo = (data as LoaderData | undefined)?.requestInfo

  const title = 'Alexandru Bereghici · bereghici.dev'
  const description = 'Software engineer specializing in JavaScript ecosystem'

  return {
    viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
    'theme-color': '#111111',
    robots: 'index,follow',
    ...getSocialMetas({
      keywords: 'alexandru, bereghici, frontend, react, javascript, typescript',
      url: getDisplayUrl(requestInfo),
      image: 'bereghici-dev/blog/avatar_bwdhvv',
      title,
      description,
    }),
  }
}

export type LoaderData = {
  ENV: ReturnType<typeof getEnv>
  nowPlayingSong: SpotifySong | null
  requestInfo: {
    origin: string
    path: string
    session: {
      theme: Theme | null
    }
  }
}

export const loader: LoaderFunction = async ({request}) => {
  // because this is called for every route, we'll do an early return for anything
  // that has a other route setup. The response will be handled there.
  if (pathedRoutes[new URL(request.url).pathname]) {
    return new Response()
  }

  const timings: Timings = {}
  const {getTheme} = await themeSessionResolver(request)
  const nowPlayingSong = await getNowPlaying()

  const data: LoaderData = {
    ENV: getEnv(),
    nowPlayingSong,
    requestInfo: {
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
      session: {
        theme: getTheme(),
      },
    },
  }

  const headers: HeadersInit = new Headers()
  headers.append('Server-Timing', getServerTimeHeader(timings))

  return json(data, {headers})
}

function App() {
  const data = useLoaderData<LoaderData>()
  const [theme] = useTheme()

  return (
    <html lang="en" className={theme ?? ''}>
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <PreventFlashOnWrongTheme
          ssrTheme={Boolean(data.requestInfo.session.theme)}
        />
        <Links />
      </head>
      <body className="bg-primary">
        <header>
          <Navbar />
        </header>
        <main id="main">
          <Outlet />
        </main>
        <Footer nowPlayingSong={data.nowPlayingSong} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
          }}
        />
        <script
          defer
          src={`https://www.googletagmanager.com/gtag/js?id=${data.ENV.GA_TRACKING_ID}`}
        />
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', '${data.ENV.GA_TRACKING_ID}', {
        page_path: window.location.pathname,
      });
      `,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>()

  return (
    <ThemeProvider
      specifiedTheme={data.requestInfo.session.theme}
      themeAction="/action/set-theme"
    >
      <App />
    </ThemeProvider>
  )
}

// best effort, last ditch error boundary. This should only catch root errors
// all other errors should be caught by the index route which will include
// the footer and stuff, which is much better.
export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return (
    <html lang="en">
      <head>
        <title>Oh no...</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-primary">
        <ServerError error={error} />
      </body>
      <Scripts />
    </html>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  console.error('CatchBoundary', caught)
  if (caught.status === 404) {
    return (
      <html lang="en">
        <head>
          <title>Oh no...</title>
          <Meta />
          <Links />
        </head>
        <body className="bg-primary">
          <FourOhFour />
        </body>
        <Scripts />
      </html>
    )
  }
  throw new Error(`Unhandled error: ${caught.status}`)
}
