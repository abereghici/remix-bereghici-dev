import React from 'react'
import * as mdxBundler from 'mdx-bundler/client'
import {buildImageUrl} from 'cloudinary-build-url'
import {getImageBuilder, getImgProps} from './images'

async function getBlurDataUrl(cloudinaryId: string) {
  const imageURL = buildImageUrl(cloudinaryId, {
    transformations: {
      resize: {width: 100},
      quality: 'auto',
      format: 'webp',
      effect: {
        name: 'blur',
        value: '1000',
      },
    },
  })
  const dataUrl = await getDataUrlForImage(imageURL)
  return dataUrl
}

async function getDataUrlForImage(imageUrl: string) {
  const res = await fetch(imageUrl)
  const arrayBuffer = await res.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const mime = res.headers.get('Content-Type') ?? 'image/webp'
  const dataUrl = `data:${mime};base64,${base64}`
  return dataUrl
}

function Image({
  cloudinaryId,
  imgProps,
}: {
  cloudinaryId: string
  imgProps: JSX.IntrinsicElements['img']
}) {
  return (
    <img
      className="my-8 w-full rounded-lg object-cover"
      {...getImgProps(getImageBuilder(cloudinaryId, imgProps.alt), {
        widths: [480, 768],
        sizes: ['(max-width: 767px) 100vw', '768px'],
        transformations: {background: 'rgb:e6e9ee'},
      })}
      {...imgProps}
    />
  )
}

const mdxComponents = {
  Image,
}

function getMdxComponent(code: string) {
  const Component = mdxBundler.getMDXComponent(code)
  function MdxComponent({
    components,
    ...rest
  }: Parameters<typeof Component>['0']) {
    return (
      <Component components={{...mdxComponents, ...components}} {...rest} />
    )
  }
  return MdxComponent
}

function useMdxComponent(code: string) {
  return React.useMemo(() => getMdxComponent(code), [code])
}

export {getMdxComponent, useMdxComponent}
