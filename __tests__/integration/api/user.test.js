const request = require('supertest');
const { testSession } = require('../helpers');
const { server } = require('../../../app');

describe('/api/users', () => {

  afterAll(() => {
    server.close();
  });

  describe('GET /users', () => {

    it('should return', async () => {
      await testSession
        .get('/api/users')
        .expect(200);
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
