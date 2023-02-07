import type {AppHandle, AppSitemapEntry} from '~/types'
import isEqual from 'lodash.isequal'
import {getDomainUrl, removeTrailingSlash, typedBoolean} from '~/utils/misc'
import type {RemixServerProps} from '@remix-run/react'

async function getSitemapXml(
  request: Request,
  remixContext: RemixServerProps['context'],
) {
  const domainUrl = getDomainUrl(request)

  function getEntry({route, lastmod, changefreq, priority}: AppSitemapEntry) {
    return `
<url>
  <loc>${domainUrl}${route}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
  ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
  ${priority ? `<priority>${priority}</priority>` : ''}
</url>
  `.trim()
  }

  const rawSitemapEntries = (
    await Promise.all(
      Object.entries(remixContext.routeModules).map(async ([id, mod]) => {
        if (id === 'root') return
        if (id.startsWith('routes/_')) return
        if (id.startsWith('__test_routes__')) return

        const handle = mod.handle as AppHandle | undefined
        if (handle?.getSitemapEntries) {
          return handle.getSitemapEntries(request)
        }

        const manifestEntry = remixContext.manifest.routes[id]
        if (!manifestEntry) {
          console.warn(`Could not find a manifest entry for ${id}`)
          return
        }
        let parentId = manifestEntry.parentId
        let parent = parentId ? remixContext.manifest.routes[parentId] : null

        let path
        if (manifestEntry.path) {
          path = removeTrailingSlash(manifestEntry.path)
        } else if (manifestEntry.index) {
          path = ''
        } else {
          return
        }

        while (parent) {
          // the root path is '/', so it messes things up if we add another '/'
          const parentPath = parent.path ? removeTrailingSlash(parent.path) : ''
          path = `${parentPath}/${path}`
          parentId = parent.parentId
          parent = parentId ? remixContext.manifest.routes[parentId] : null
        }

        // we can't handle dynamic routes, so if the handle doesn't have a
        // getSitemapEntries function, we just
        if (path.includes(':')) return
        if (id === 'root') return

        const entry: AppSitemapEntry = {route: removeTrailingSlash(path)}
        return entry
      }),
    )
  )
    .flatMap(z => z)
    .filter(typedBoolean)

  const sitemapEntries: Array<AppSitemapEntry> = []
  for (const entry of rawSitemapEntries) {
    const existingEntryForRoute = sitemapEntries.find(
      e => e.route === entry.route,
    )
    if (existingEntryForRoute) {
      if (!isEqual(existingEntryForRoute, entry)) {
        console.warn(
          `Duplicate route for ${entry.route} with different sitemap data`,
          {entry, existingEntryForRoute},
        )
      }
    } else {
      sitemapEntries.push(entry)
    }
  }

  return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  ${sitemapEntries.map(entry => getEntry(entry)).join('')}
</urlset>
  `.trim()
}

export {getSitemapXml}
