const request = require('supertest');
const { app, server } = require('../../../app');

describe('/api/users', () => {

  afterAll(() => {
    server.close();
  });

  describe('GET /users', () => {

    it('should return a list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('links');
      expect(response.body.data.length).toBeTruthy();
    });

  });

  describe('GET /users/:user_id', () => {

    it('should be true', () => {

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
