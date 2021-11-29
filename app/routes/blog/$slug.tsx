import {useLoaderData} from 'remix'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import ResponsiveContainer from '~/components/responsive-container'
import {H1, Paragraph} from '~/components/typography'
import {useMdxComponent} from '~/utils/mdx'
import {getPost} from '~/utils/posts.server'

export async function loader({params}: {params: {slug: string}}) {
  const {slug} = params

  return getPost(slug)
}

export default function FullArticle() {
  const post = useLoaderData()

  const {title, readingTime, date, code} = post

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
            {format(parseISO(date), 'MMMM dd, yyyy')}
          </Paragraph>
        </div>
        <Paragraph size="small" className="mt-2 t min-w-32 md:mt-0">
          {readingTime}
          {` • `}0 views
        </Paragraph>
      </div>
      <div className="mt-9 prose dark:prose-dark">
        <Component />
      </div>
    </ResponsiveContainer>
  )
}
