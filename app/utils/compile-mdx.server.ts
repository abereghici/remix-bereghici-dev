import {bundleMDX} from 'mdx-bundler'
import type TPQueue from 'p-queue'
import fs from 'fs'
import calculateReadingTime from 'reading-time'

async function compileMdx<FrontmatterType extends Record<string, unknown>>(
  dir: string,
  mdxFile: string,
) {
  try {
    const path = `${__dirname}/../content/${dir}/${mdxFile}`

    const filContent = fs.readFileSync(path, 'utf8')

    const {default: remarkGfm} = await import('remark-gfm')
    const {default: rehypeSlug} = await import('rehype-slug')
    const {default: rehypeCodeTitles} = await import('rehype-code-titles')
    const {default: rehypeAutolinkHeadings} = await import(
      'rehype-autolink-headings'
    )
    const {default: rehypePrism} = await import('rehype-prism-plus')

    const {frontmatter, code} = await bundleMDX({
      source: filContent,
      xdmOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm]
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeSlug,
          rehypeCodeTitles,
          rehypePrism,
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ['anchor'],
              },
            },
          ],
        ]
        return options
      },
    })

    const readingTime = calculateReadingTime(filContent)

    return {
      code,
      readingTime,
      slug: mdxFile.replace(/\.(md|mdx)$/, ''),
      frontmatter: frontmatter as FrontmatterType,
    }
  } catch (error: unknown) {
    console.error(`Compilation error for mdxFile: `, mdxFile)
    throw error
  }
}

let _queue: TPQueue | null = null
async function getQueue() {
  const {default: PQueue} = await import('p-queue')
  if (_queue) return _queue

  _queue = new PQueue({concurrency: 1})
  return _queue
}

// We have to use a queue because we can't run more than one of these at a time
// or we'll hit an out of memory error because esbuild uses a lot of memory...
async function queuedCompileMdx<
  FrontmatterType extends Record<string, unknown>,
>(...args: Parameters<typeof compileMdx>) {
  const queue = await getQueue()
  const result = await queue.add(() => compileMdx<FrontmatterType>(...args))
  return result
}

export {queuedCompileMdx as compileMdx}
