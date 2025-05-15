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

module.exports = {
  dummy, totalLikes, favouriteBlog
}