import React from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import orderby from 'lodash.orderby'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../content'
import { GetStaticProps } from 'next'

const Blog = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const cmsPosts = (ctx.preview ? postsFromCMS.draft : postsFromCMS.published).map(post => matter(post).data)

  const postPath = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postPath)
  const filePosts = filenames.map(name => {
    const fullPath = path.join(process.cwd(), 'posts' ,name)
    const file = fs.readFileSync(fullPath, 'utf-8')
    const { data } = matter(file)
    return data
  })

  const posts = [...cmsPosts, ...filePosts]

  return {
    props: {
      posts: posts
    }
  }
}

export default Blog

/**
 * Need to get the posts from the
 * fs and our CMS
 */
