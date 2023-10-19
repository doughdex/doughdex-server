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

    it('should be true', () => {

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
