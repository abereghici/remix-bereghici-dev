import {getBlogMdxListItems} from '~/utils/mdx'
import {getDomainUrl} from '~/utils/misc'

async function getRssFeedXml(request: Request) {
  const posts = await getBlogMdxListItems({request})

  const blogUrl = `${getDomainUrl(request)}/blog`

  return `
    <rss xmlns:blogChannel="http://backend.userland.com/blogChannelModule" version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Alexandru Bereghici Blog</title>
        <link>${blogUrl}</link>
        <description>Alexandru Bereghici Blog</description>
        <copyright>All rights reserved copyright Alexandru Bereghici 2022</copyright>
        <language>en-us</language>
        <atom:link href="${blogUrl}/rss.xml" rel="self" type="application/rss+xml" />
        <ttl>40</ttl>
        ${posts
          .map(post =>
            `
            <item>
              <title>${cdata(post.frontmatter.title)}</title>
              <description>${cdata(post.frontmatter.description)}</description>
              <pubDate>${new Date(
                post.frontmatter.date,
              ).toUTCString()}</pubDate>
              <link>${blogUrl}/${post.slug}</link>
              <guid>${blogUrl}/${post.slug}</guid>
            </item>
          `.trim(),
          )
          .join('\n')}
      </channel>
    </rss>
  `.trim()
}

function cdata(s: string) {
  return `<![CDATA[${s}]]>`
}

export {getRssFeedXml}
