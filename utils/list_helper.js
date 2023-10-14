const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length > 0 ? blogs.reduce((total, blog) => total + blog.likes, 0) : 0
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const mostFavorited = blogs.reduce((maxLikedBlog, currentBlog) => {
    return currentBlog.likes > maxLikedBlog.likes ? currentBlog : maxLikedBlog
  }, blogs[0])

  return {
    title: mostFavorited.title,
    author: mostFavorited.author,
    likes: mostFavorited.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const authorBlogCount = _.countBy(blogs, 'author')

  let mostBlogsAuthor = null
  let mostBlogsCount = 0

  for (const author in authorBlogCount) {
    if (authorBlogCount[author] > mostBlogsCount) {
      mostBlogsAuthor = author
      mostBlogsCount = authorBlogCount[author]
    }
  }

  return {
    author: mostBlogsAuthor,
    blogs: mostBlogsCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const authorLikes = {}

  blogs.forEach(blog => {
    const author = blog.author
    const likes = blog.likes

    if (authorLikes[author]) {
      authorLikes[author] += likes
    } else {
      authorLikes[author] = likes
    }
  })

  let mostLikedAuthor = null
  let mostLikes = 0

  for (const author in authorLikes) {
    if (authorLikes[author] > mostLikes) {
      mostLikedAuthor = author
      mostLikes = authorLikes[author]
    }
  }

  return {
    author: mostLikedAuthor,
    likes: mostLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
