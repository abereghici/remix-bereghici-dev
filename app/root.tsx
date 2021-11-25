import {
  Links,
  Meta,
  Scripts,
  Outlet,
  LiveReload,
  LoaderFunction,
  json,
  useLoaderData,
} from 'remix'
import type {LinksFunction} from 'remix'
import {
  useTheme,
  ThemeProvider,
  NonFlashOfWrongThemeEls,
  Theme,
} from './utils/theme-provider'
import {getThemeSession} from './utils/theme.server'
import {getDomainUrl} from './utils/misc'
import {pathedRoutes} from './other-routes.server'
import Navbar from './components/navbar'

import tailwindStyles from './styles/tailwind.css'

export let links: LinksFunction = () => {
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
    {rel: 'stylesheet', href: tailwindStyles},
  ]
}

export type LoaderData = {
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

  const themeSession = await getThemeSession(request)

  const data: LoaderData = {
    requestInfo: {
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
      session: {
        theme: themeSession.getTheme(),
      },
    },
  }

  const headers: HeadersInit = new Headers()

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
        <NonFlashOfWrongThemeEls
          ssrTheme={Boolean(data.requestInfo.session.theme)}
        />
        <Links />
      </head>
      <body className="bg-primary">
        <Navbar />
        <Outlet />
        <Scripts />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>()

  return (
    <ThemeProvider specifiedTheme={data.requestInfo.session.theme}>
      <App />
    </ThemeProvider>
  )
}
