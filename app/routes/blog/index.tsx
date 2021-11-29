import {useLoaderData} from 'remix'
import {getAllPosts, Post} from '~/utils/posts.server'
import ResponsiveContainer from '~/components/responsive-container'
import BlogPost from '~/components/blog-post'
import {H1} from '~/components/typography'

export async function loader() {
  const posts = await getAllPosts()
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export default function Index() {
  let posts = useLoaderData()

  return (
    <ResponsiveContainer>
      <H1 className="mb-10 w-full tracking-tight">All posts</H1>
      <ul>
        {posts.map((post: Post) => (
          <li key={post.slug}>
            <BlogPost
              slug={post.slug}
              title={post.title}
              description={post.description}
            />
          </li>
        ))}
      </ul>
    </ResponsiveContainer>
  )
}
