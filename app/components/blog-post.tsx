import {Link} from 'react-router-dom'
import {Post} from '~/utils/posts.server'
import {H4, Paragraph} from '~/components/typography'

export default function BlogPost({
  title,
  description,
  slug,
}: Pick<Post, 'title' | 'description' | 'slug'>) {
  const views = 0
  return (
    <Link to={slug} className="block mb-8">
      <div className="flex flex-col justify-between md:flex-row w-full">
        <H4 className="mb-2">{title}</H4>
        <Paragraph variant="secondary" className="mb-4">
          {`${views ? new Number(views).toLocaleString() : '–'} views`}
        </Paragraph>
      </div>
      <Paragraph variant="secondary">{description}</Paragraph>
    </Link>
  )
}
