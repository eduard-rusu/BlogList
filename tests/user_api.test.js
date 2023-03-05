const supertest = require('supertest');
const helper = require('./user_helper');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

beforeAll(async () => {
  await app.connectToDb();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('user tests', () => {
  test('get users returns correclty', async () => {
    const usersAtStart = await helper.usersInDb();
    const user = new User({
      username: 'asdfg',
      passwordHash: 'ffffffffffff',
      blogs: [],
    });
    await user.save();
    await api
      .get('/api/users')
      .expect(200);

    const users = await helper.usersInDb();
    expect(users.length).toBe(usersAtStart.length + 1);
    expect(users[0].username).toBe(user.username);
  });

  test('post invalid username failed correctly', async () => {
    const user = {
      username: 'a',
      password: 'password',
    };

    const res = await api
      .post('/api/users')
      .send(user)
      .expect(400);

    expect(res.body.error).toContain('is shorter than the minimum');

    const users = await helper.usersInDb();
    expect(users.length).toBe(0);
  });

  test('post invalid password failed correctly', async () => {
    const user = {
      username: 'valid',
      password: 'p',
    };

    const res = await api
      .post('/api/users')
      .send(user)
      .expect(400);

    expect(res.body.error).toBe('Password too short');
  });

  test('post duplicate usernames failed correctly', async () => {
    const user = new User({
      username: 'root',
      passwordHash: 'root',
      blogs: [],
    });
    await user.save();

    const duplicateUser = {
      username: 'root',
      password: 'test',
    };

    const res = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400);

    console.log(res.body.error);
    expect(res.body.error).toContain('11000');
  });

  test('post successful', async () => {
    const user = {
      username: 'root',
      password: 'password',
    };

    const res = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const savedUser = res.body;
    expect(savedUser).toEqual(expect.objectContaining({
      username: expect.any(String),
      id: expect.any(String),
    }));
    expect(savedUser.username).toBe(user.username);
  });
});

afterAll(async () => {
  await app.disconnectFromDb();
});
