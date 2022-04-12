import * as React from 'react'
import {renderToString} from 'react-dom/server'
import {RemixServer} from 'remix'
import type {EntryContext} from 'remix'
import {routes as otherRoutes} from './other-routes.server'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  for (const handler of otherRoutes) {
    // eslint-disable-next-line no-await-in-loop
    const otherRouteResponse = await handler(request, remixContext)
    if (otherRouteResponse) return otherRouteResponse
  }

  const markup = renderToString(
    // @ts-expect-error will be fixed in next major version
    <RemixServer context={remixContext} url={request.url} />,
  )

  if (process.env.NODE_ENV !== 'production') {
    responseHeaders.set('Cache-Control', 'no-store')
  }

  const html = `<!DOCTYPE html>${markup}`

  responseHeaders.set('Content-Type', 'text/html')
  responseHeaders.set('Content-Length', String(Buffer.byteLength(html)))
  responseHeaders.set('X-Frame-Options', 'deny')
  responseHeaders.set('X-Content-Type-Options', 'nosniff')
  responseHeaders.set('Referrer-Policy', 'no-referrer-when-downgrade')
  responseHeaders.set('Permissions-Policy', 'fullscreen=()')

  // https://securityheaders.com
  const ContentSecurityPolicy = `
  default-src 'self';
  worker-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com;
  child-src 'self';
  frame-src 'self' codesandbox.io;
  style-src 'self' 'unsafe-inline' ;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
`
  responseHeaders.set(
    'Content-Security-Policy',
    ContentSecurityPolicy.replace(/\n/g, ''),
  )

  return new Response(html, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
