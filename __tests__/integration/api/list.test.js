const helpers = require('../helpers');
const request = require('supertest');
const { app, server } = require('../../../app');

describe('/api/lists', () => {

  afterAll(() => {
    server.close();
  });

  describe('GET /lists', () => {

    it('should return the first page of lists with a limit of 10 lists per page when no query params are provided', async () => {
      const response = await request(app)
        .get('/api/lists')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('links');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('user_id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('is_private');
      expect(response.body.data[0]).toHaveProperty('is_ordered');
      expect(response.body.data[0]).toHaveProperty('is_flagged');
      expect(response.body.data[0]).toHaveProperty('created_at');
    });

    it('should return the first page of lists with a limit of 10 lists per page when invalid query params are provided', async () => {
      const response = await request(app)
        .get('/api/lists?page=a&limit=b')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });

    it('should return the provided page of lists when valid page and limit query params are provided', async () => {
      const response = await request(app)
        .get('/api/lists?page=2&limit=5')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.page).toBe('2');
      expect(response.body.limit).toBe('5');
    });

    it('should return an empty array if no lists are found', async () => {
      await helpers.resetDatabase();

      const response = await request(app)
        .get('/api/lists')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).toHaveLength(0);
    });

    it('should not return any flagged lists', async () => {
      const response = await request(app)
        .get('/api/lists')
        .expect(200)
        .expect('Content-Type', /json/);

      for (const list of response.body.data) {
        expect(list.is_flagged).toBe(false);
      }
    });

    it('should not return any private lists', async () => {
      const response = await request(app)
        .get('/api/lists')
        .expect(200)
        .expect('Content-Type', /json/);

      for (const list of response.body.data) {
        expect(list.is_private).toBe(false);
      }
    });

    it('should not return any lists created by banned users', async () => {
      const response = await request(app)
        .get('/api/lists')
        .expect(200)
        .expect('Content-Type', /json/);

      for (const list of response.body.data) {
        expect(parseInt(list.user_id)).not.toBe(3);
      }
    });

    it('should not return any lists created by archived users', async () => {
      const response = await request(app)
        .get('/api/lists')
        .expect(200)
        .expect('Content-Type', /json/);

      for (const list of response.body.data) {
        expect(parseInt(list.user_id)).not.toBe(4);
      }
    });

    it('should not return any lists created by private users', async () => {
      const response = await request(app)
      .get('/api/lists')
      .expect(200)
      .expect('Content-Type', /json/);

      for (const list of response.body.data) {
        expect(parseInt(list.user_id)).not.toBe(5);
      }
    });
  });

  describe('GET /lists/:list_id', () => {

  });

  describe('POST /lists', () => {

  });

  describe('PUT /lists/:list_id', () => {

  });

  describe('DELETE /lists/:list_id', () => {

  });

  describe('POST /lists/:list_id/spots', () => {

  });

  describe('DELETE /lists/:list_id/spots/:spot_id', () => {

  });
});