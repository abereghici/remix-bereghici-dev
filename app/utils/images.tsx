import type {TransformerOption} from '@cld-apis/types'
import {setConfig, buildImageUrl} from 'cloudinary-build-url'

setConfig({
  cloudName: 'bereghici-dev',
})

type ImageBuilder = {
  (transformations?: TransformerOption): string
  alt: string
  id: string
}

function getImageBuilder(id: string, alt: string = ''): ImageBuilder {
  function imageBuilder(transformations?: TransformerOption) {
    return buildImageUrl(id, {transformations})
  }
  imageBuilder.alt = alt
  imageBuilder.id = id
  return imageBuilder
}

function getImgProps(
  imageBuilder: ImageBuilder,
  {
    widths,
    sizes,
    transformations,
  }: {
    widths: Array<number>
    sizes: Array<string>
    transformations?: TransformerOption
  },
) {
  const averageSize = Math.ceil(widths.reduce((a, s) => a + s) / widths.length)

  return {
    alt: imageBuilder.alt,
    src: imageBuilder({
      quality: 'auto',
      format: 'auto',
      ...transformations,
      resize: {width: averageSize, ...transformations?.resize},
    }),
    srcSet: widths
      .map(width =>
        [
          imageBuilder({
            quality: 'auto',
            format: 'auto',
            ...transformations,
            resize: {width, ...transformations?.resize},
          }),
          `${width}w`,
        ].join(' '),
      )
      .join(', '),
    sizes: sizes.join(', '),
  }
}

export {getImgProps, getImageBuilder}
export type {ImageBuilder}
