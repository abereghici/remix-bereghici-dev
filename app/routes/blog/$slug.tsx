import * as React from 'react'
import {json, useLoaderData} from 'remix'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import ResponsiveContainer from '~/components/responsive-container'
import {H1, Paragraph} from '~/components/typography'
import {useMdxComponent} from '~/utils/mdx'
import {getPost, Post} from '~/utils/posts.server'
import type {AppLoader} from '~/types'
import {addPostRead} from '~/utils/prisma.server'

type LoaderData = {
  post: Post
}

export const loader: AppLoader<{slug: string}> = async ({params}) => {
  const {slug} = params
  const post = await getPost(slug)

  if (!post) {
    throw json({status: 404})
  }

  const viewId = Number(post.views.id)
  await addPostRead(isNaN(viewId) ? 0 : viewId, slug)
  const data: LoaderData = {post}

  return json(data)
}

export default function FullArticle() {
  const {post} = useLoaderData<LoaderData>()
  const {frontmatter, readTime, code, views} = post
  const {title, date} = frontmatter

  const Component = useMdxComponent(code)

  return (
    <ResponsiveContainer>
      <H1 className="mb-4 tracking-tight">{title}</H1>
      <div className="flex flex-col items-start justify-between w-full mt-2 md:flex-row md:items-center">
        <div className="flex items-center">
          <img
            alt="Alexandru Bereghici"
            height={24}
            width={24}
            src="/avatar.jpeg"
            className="rounded-full"
          />
          <Paragraph className="ml-2 " size="small">
            {'Alexandru Bereghici / '}
            {format(
              date instanceof Date ? date : parseISO(date),
              'MMMM dd, yyyy',
            )}
          </Paragraph>
        </div>
        <Paragraph size="small" className="mt-2 t min-w-32 md:mt-0">
          {readTime?.text}
          {` • `}
          {views.count} views
        </Paragraph>
      </div>
      <div className="mt-9 prose dark:prose-dark">
        <Component />
      </div>
    </ResponsiveContainer>
  )
}
