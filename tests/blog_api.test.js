// const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogs = helper.initialBlogs.map((b) => new Blog(b));
  for (let i = 0; i < blogs.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await blogs[i].save();
  }
});

describe('api tests', () => {
  test('http get test', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  test('correct amount of blogs returned', async () => {
    const blogs = await helper.notesInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs have id property', async () => {
    const blogs = await helper.notesInDb();
    expect(blogs[0].id).toBeDefined();
  });

  test('can add new Blog posts', async () => {
    const blog = {
      title: 'My Title',
      author: 'My Name',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 666,
    };

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /json/);

    const blogs = await helper.notesInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
    blog.id = blogs[blogs.length - 1].id;
    expect(blogs[blogs.length - 1]).toEqual(blog);
  });

  test('likes property defaults to zero', async () => {
    const blog = {
      title: 'My Title',
      author: 'My Name',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    };
    const blogToSave = new Blog(blog);
    await blogToSave.save();
    const blogToCheck = await Blog.findOne(blog);
    expect(blogToCheck).toHaveProperty('likes', 0);
  });

  test('title and url are required', async () => {
    const blog = {
      author: 'My Name',
      likes: 666,
    };

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(400);
  });
});
