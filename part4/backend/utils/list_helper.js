const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce(function (a, b) {
    return a + b['likes']
  }, 0)
}

const favoriteBlog = blogs => {
  let favBlog = {}
  let currHighest = 0
  blogs.forEach(blog => {
    if (blog.likes > currHighest) {
      currHighest = blog.likes
      favBlog = blog
    }
  })
  return favBlog
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return {}
  }
  let authors = _.countBy(blogs, 'author')
  let mostBlogsAuthor = _.maxBy(Object.keys(authors), author => authors[author])
  const result = {
    author: mostBlogsAuthor,
    blogs: authors[mostBlogsAuthor]
  }
  return result
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return {}
  }
  const authorLikes = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, 'likes')
    }))
    .value()
  const mostLikedAuthor = _.maxBy(authorLikes, 'likes')

  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
