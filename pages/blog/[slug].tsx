import React, { FC } from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Post } from '../../types'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { posts } from '../../content'
import renderToString from  'next-mdx-remote/render-to-string'
import { GetStaticProps } from 'next'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = hydrate(source)
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }
  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}

export const getStaticPaths = () => {

  const postPath = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postPath)

  const slugs = filenames.map(name => {
    const filePath = path.join(postPath, name)
    const file = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(file)
    return data
  })

  return {
    paths: slugs.map(s => ({ params: { slug: s.slug } })),
    fallback: true
  }
}

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  let post
  try {
    const filePath = path.join(process.cwd(), 'posts',  params.slug + 'mdx')
    const match = fs.readFileSync(filePath, 'utf-8')
    post = match
  } catch {
    const cmsPosts = ( preview ? posts.draft : posts.published).map(post => matter(post))
    const match = cmsPosts.find(p => p.data.slug === params.slug)
    
    if(!match) {
      // Eror Handling
    }

    post = match.content
  }

  const { data } = matter(post)
  const mdxSource = await renderToString(post, { scope: data })

  return {
    props: {
      source: mdxSource,
      frontMatter: data
    }
  }

}

export default BlogPost
