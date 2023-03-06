const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./blog_helper');

const api = supertest(app);
let token = null;
let userid = null;

beforeAll(async () => {
  app.connectToDb();
  await User.deleteMany({});
  const user = new User({
    username: 'root',
    passwordHash: await bcrypt.hash('root', 10),
  });
  await user.save();
  const res = await api
    .post('/api/login')
    .send({ username: 'root', password: 'root' });

  token = res.body.token;
  // eslint-disable-next-line no-underscore-dangle
  userid = user._id;
});

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
      user: userid,
      likes: 666,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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

  test('delete returns code 204 on success', async () => {
    const blog = helper.initialBlogs[0];
    const blogToSave = new Blog(blog);
    await blogToSave.save();

    let blogToDelete = await Blog.findOne(blog);
    blogToDelete = blogToDelete.toJSON();
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
  });

  test('delete returns code 404 for non existing id', async () => {
    const nonexistingId = await helper.nonexistingId({ token });
    await api
      .delete(`/api/blogs/${nonexistingId}`)
      .expect(404);
  });

  test('put returns code 200 with new Blog on sucess', async () => {
    const blog = {
      title: 'My Title',
      author: 'My Name',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 666,
    };
    const blogToModify = new Blog(blog);
    await blogToModify.save();
    blog.title = 'New Title';

    let blogToCheck = await api
      // eslint-disable-next-line no-underscore-dangle
      .put(`/api/blogs/${blogToModify._id.toString()}`)
      .send(blog)
      .expect(200);
    blogToCheck = blogToCheck.body;
    delete blogToCheck.id;
    expect(blog).toEqual(blogToCheck);
  });

  test('put returns code 404 for non existing id', async () => {
    const nonexistingId = await helper.nonexistingId({ token });
    await api
      .put(`/api/blogs/${nonexistingId}`)
      .expect(404);
  });
});

afterAll(async () => {
  await app.disconnectFromDb();
});
