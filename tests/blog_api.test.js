const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('should return blogs with right unique identifier property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert(blog.id !== undefined)
      assert(blog._id === undefined)
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

    test('should add a blog with zero likes if likes property is missing', async () => {
      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)

      const blogsInDb = await api.get('/api/blogs')
      assert.strictEqual(blogsInDb.body.length, helper.initialBlogs.length + 1)
    })

    test('should return 400 error if title property is missing', async () => {

      await api
        .post('/api/blogs')
        .send(helper.blogWithoutTitle)
        .expect(400)


      const blogsInDb = await api.get('/api/blogs')
      assert.strictEqual(blogsInDb.body.length, helper.initialBlogs.length)
    })

    test('should return 400 error if author property is missing', async () => {

      await api
        .post('/api/blogs')
        .send(helper.blogWithoutAuthor)
        .expect(400)


      const blogsInDb = await api.get('/api/blogs')
      assert.strictEqual(blogsInDb.body.length, helper.initialBlogs.length)
    })

    test('should return 400 error if url property is missing', async () => {

      await api
        .post('/api/blogs')
        .send(helper.blogWithoutUrl)
        .expect(400)


      const blogsInDb = await api.get('/api/blogs')
      assert.strictEqual(blogsInDb.body.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
      
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('editing a blog', () => {
    test('updates the likes of the blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedLikes = 69

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: updatedLikes})
        .expect(200)
      
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

      assert.strictEqual(updatedBlog.likes, updatedLikes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})