import * as React from 'react'
import {json, LoaderFunction, useLoaderData} from 'remix'
import {getServerTimeHeader, Timings} from '~/utils/metrics.server'
import ResponsiveContainer from '~/components/responsive-container'
import {ServerError} from '~/components/errors'
import {getMdxPage, mdxPageMeta, useMdxComponent} from '~/utils/mdx'
import type {MdxPage} from '~/types'
import {H1} from '~/components/typography'

type LoaderData = {
  page: MdxPage
}

export const meta = mdxPageMeta

export const loader: LoaderFunction = async ({request}) => {
  const timings: Timings = {}

  const page = await getMdxPage(
    {
      slug: 'cv',
      contentDir: 'pages',
    },
    {request, timings},
  )

  if (!page) {
    throw new Response('Not found', {status: 404})
  }

  const data: LoaderData = {page}
  return json(data, {
    headers: {
      'Server-Timing': getServerTimeHeader(timings),
    },
  })
}

export default function CV() {
  const {page} = useLoaderData<LoaderData>()
  const {title} = page.frontmatter

  const Component = useMdxComponent(page.code)

  return (
    <ResponsiveContainer>
      <H1 className="mb-4 tracking-tight">{title}</H1>
      <div className="prose dark:prose-dark">
        <Component />
      </div>
    </ResponsiveContainer>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)
  return <ServerError error={error} />
}
