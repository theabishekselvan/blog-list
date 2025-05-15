const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0)
}

const favouriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((max, blog) => {
      return blog.likes > max.likes ? blog : max
    })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = {}

  blogs.forEach(blog => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  });

  let maxAuthor = ''
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = authorCounts[author]
    }
  }
  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs
}