import React from 'react'
import * as mdxBundler from 'mdx-bundler/client'
import {getImageBuilder, getImgProps} from './images'

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
