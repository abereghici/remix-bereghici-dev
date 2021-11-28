import fs from 'fs'
import {compileMdx} from '~/utils/compile-mdx.server'

function getMdxFilesFromDir<FrontmatterType extends Record<string, unknown>>(
  dir: string,
) {
  try {
    const files = fs.readdirSync(`${__dirname}/../content/${dir}`, 'utf-8')
    const mdxFiles = files.filter(
      file => file.endsWith('.mdx') || file.endsWith('.md'),
    )

    return Promise.all(
      mdxFiles.map(file => compileMdx<FrontmatterType>(dir, file)),
    )
  } catch (e: unknown) {
    return Promise.reject(e)
  }
}

async function getMdxFile<FrontmatterType extends Record<string, unknown>>(
  dir: string,
  file: string,
) {
  try {
    return compileMdx<FrontmatterType>(dir, file)
  } catch (e: unknown) {
    return Promise.reject(e)
  }
}

export {getMdxFilesFromDir, getMdxFile}
