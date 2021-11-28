import {useLoaderData} from 'remix'
import {getAllPosts, Post} from '~/utils/posts.server'
import ResponsiveContainer from '~/components/responsive-container'
import BlogPost from '~/components/blog-post'

export async function loader() {
  const posts = await getAllPosts()
  return posts
}

export default function Index() {
  let posts = useLoaderData()

  return (
    <ResponsiveContainer>
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
