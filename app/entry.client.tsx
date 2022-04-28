import * as React from 'react'
import ReactDOM from 'react-dom'
import {RemixBrowser as Remix} from '@remix-run/react'
import * as Sentry from '@sentry/browser'
import {Integrations} from '@sentry/tracing'

Sentry.init({
  dsn: window.ENV.SENTRY_DSN,
  release: 'bereghici.dev@1.0.0',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
})

ReactDOM.hydrate(<Remix />, document)
