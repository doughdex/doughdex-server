const request = require('supertest');
const { app, server } = require('../../../app');
const helpers = require('../helpers');

describe('/api/users', () => {

  afterAll(() => {
    server.close();
  });

  describe('GET /users', () => {

    it('should return the first page of users with a limit of 10 users per page when no query params are provided', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('links');
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('email');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('display_name');
      expect(response.body.data[0]).toHaveProperty('location');
      expect(response.body.data[0]).toHaveProperty('timezone');
      expect(response.body.data[0]).toHaveProperty('bio');
      expect(response.body.data[0]).toHaveProperty('avatar_url');
      expect(response.body.data[0]).toHaveProperty('is_banned');
      expect(response.body.data[0]).toHaveProperty('is_private');
      expect(response.body.data[0]).toHaveProperty('total_count');
    });

    it('should return a list of users when page and limit query params are provided', async () => {
      const response = await request(app)
        .get('/api/users?page=2&limit=5')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(5);
      expect(response.body.data).toBeTruthy();
    });

    it('should not return any private or banned users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/);

      for (const user of response.body.data) {
        expect(user.is_private).toBe(false);
        expect(user.is_banned).toBe(false);
      }
    });

    it('should return an empty array if no users are found', async () => {
      await helpers.resetDatabase();

      const response = await request(app)
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).toEqual([]);
      expect(response.body.links.next).toBeNull();
      expect(response.body.links.prev).toBeNull();
      expect(response.body.links.first).toBeNull();
      expect(response.body.links.last).toBeNull();
    });
  });

  describe('GET /users/:user_id', () => {

    it('should return a user with a valid user_id param', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('display_name');
      expect(response.body).toHaveProperty('location');
      expect(response.body).toHaveProperty('timezone');
      expect(response.body).toHaveProperty('bio');
      expect(response.body).toHaveProperty('avatar_url');
      expect(response.body).toHaveProperty('is_banned');
      expect(response.body).toHaveProperty('is_private');
      expect(response.body.id).toBe(1);
    });

    it('should return a 404 error if no user is found', async () => {
      const response = await request(app)
        .get('/api/users/999999')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'User not found' });
    });

    it('should handle an invalid user_id param', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Invalid user id' });
    });

    it('should return a 401 error if the user is private and the user is not the owner', async () => {
      const testToken = 'user1Token';
      const response = await request(app)
        .get('/api/users/2')
        .set({'Authorization': `Bearer ${testToken}`})
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should return a user if the user is private and the user is the owner', async () => {
      const testToken = 'user2Token';
      const response = await request(app)
        .get('/api/users/2')
        .set({'Authorization': `Bearer ${testToken}`})
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
    });
  });

  describe('POST /users', () => {

    it('should create a new user and return a 201 status and user data when provided valid inputs', async () => {
      const testUser = {
        uid: 'testuid',
        email: 'test@test.com',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/users')
        .send(testUser)
        .set({'content-type': 'application/json'})
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('uid');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('display_name');
      expect(response.body).toHaveProperty('location');
      expect(response.body).toHaveProperty('timezone');
      expect(response.body).toHaveProperty('bio');
      expect(response.body).toHaveProperty('avatar_url');
      expect(response.body).toHaveProperty('is_banned');
      expect(response.body).toHaveProperty('is_private');
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('last_login_at');
      expect(response.body.uid).toBe(testUser.uid);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.display_name).toBe(testUser.name);
      expect(response.body.location).toBeNull();
      expect(response.body.timezone).toBeNull();
      expect(response.body.bio).toBeNull();
      expect(response.body.avatar_url).toBeNull();
      expect(response.body.is_banned).toBe(false);
      expect(response.body.is_private).toBe(false);
      expect(response.body.created_at).toBeTruthy();
      expect(response.body.last_login_at).toBeTruthy();
    });

    it('should return a 400 error if uid is missing', async () => {
      const testUser = {
        email: 'test@test.com',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/users')
        .send(testUser)
        .set({'content-type': 'application/json'})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Missing required fields' });

    });

    it('should return a 400 error if email is missing', async () => {
      const testUser = {
        uid: 'testuid',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/users')
        .send(testUser)
        .set({'content-type': 'application/json'})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Missing required fields' });
    });

    it('should return a 400 error if name is missing', async () => {
      const testUser = {
        uid: 'testuid',
        email: 'test@test.com',
      };

      const response = await request(app)
        .post('/api/users')
        .send(testUser)
        .set({'content-type': 'application/json'})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Missing required fields' });
    });

    it('should return a 400 error if the email is invalid', async () => {
      const testUser = {
        uid: 'testuid',
        email: 'testtest.com',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/users')
        .send(testUser)
        .set({'content-type': 'application/json'})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Invalid email address' });
    });

    it('should return a 400 error if the uid is already in use', async () => {
      const testUser = {
        uid: 'user1',
        email: 'test1@test.com',
        name: 'Test User 1'
      };

      const response = await request(app)
      .post('/api/users')
      .send(testUser)
      .set({'content-type': 'application/json'})
      .expect(400)
      .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Uid already in use' });
    });

    it('should return a 400 error if the email is already in use', async () => {
      const testUser = {
        uid: 'testuid2',
        email: 'john.doe@example.com',
        name: 'Test User 1'
      };

      const response = await request(app)
        .post('/api/users')
        .send(testUser)
        .set({'content-type': 'application/json'})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Email already in use' });
    });
  });

  describe('PUT /users/:user_id', () => {

    it('should be true', () => {

    });

  });

  describe('DELETE /users/:user_id', () => {

    it('should be true', () => {

    });

  });

  describe('GET /users/:user_id/lists', () => {

    it('should be true', () => {

    });

  });
});
