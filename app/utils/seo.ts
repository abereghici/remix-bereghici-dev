import {getImageBuilder} from './images'

export function getSocialMetas({
  url,
  title = 'Helping people make the world a better place through quality software',
  description = 'Make the world better with software',
  image,
  keywords = '',
}: {
  image: string
  url: string
  title?: string
  description?: string
  keywords?: string
}) {
  const imageUrl = getImageBuilder(image)({
    quality: 'auto',
    format: 'auto',
  })

  return {
    title,
    description,
    keywords,
    image: imageUrl,
    'og:url': url,
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl,
    'twitter:card': imageUrl ? 'summary_large_image' : 'summary',
    'twitter:creator': '@alexandrubrg',
    'twitter:site': '@alexandrubrg',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,
    'twitter:alt': title,
  }
}
