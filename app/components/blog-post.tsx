import * as React from 'react'
import {Link} from 'remix'
import {Title, Paragraph} from '~/components/typography'
import Tag from '~/components/tag'
import type {PostItem} from '~/types'
import {getImageBuilder, getImgProps} from '~/utils/images'

export default function BlogPost({post}: {post: PostItem}) {
  const {slug, views, frontmatter} = post
  const {title, description, categories, bannerCloudinaryId} = frontmatter

  return (
    <Link to={slug}>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex flex-col overflow-hidden">
        {bannerCloudinaryId && (
          <img
            className="w-full object-cover"
            {...getImgProps(getImageBuilder(bannerCloudinaryId, ''), {
              widths: [480, 768],
              sizes: ['(max-width: 767px) 100vw', '480px'],
              transformations: {background: 'rgb:e6e9ee'},
            })}
            alt=""
          />
        )}
        <div className="flex flex-col p-3 flex-grow">
          <div className="flex flex-wrap mb-1">
            {categories.map(category => (
              <Tag className="m-1" key={category} category={category} />
            ))}
          </div>
          <Title as="h4" size="h6">
            {title}
          </Title>

          <Paragraph
            variant="secondary"
            size="small"
            className="mt-2 mb-4 line-clamp-3"
          >
            {description}
          </Paragraph>

          <Paragraph variant="secondary" className="mt-auto">
            👀 {views ? views.toLocaleString() : '–'}
          </Paragraph>
        </div>
      </article>
    </Link>
  )
}
