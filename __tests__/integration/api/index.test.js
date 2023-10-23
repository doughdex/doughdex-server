const request = require('supertest');
const { app, server } = require('../../../app');

describe('/api/check', () => {

  afterAll(() => {
    server.close();
  });

  it('returns success', async () => {
    await request(app).get('/api/check').expect(204);
  });

  it('should handle invalid routes with api prefix', async () => {
    await request(app).get('/api/invalid').expect(404);
  });

  it('should handle invalid routes', async () => {
    await request(app).get('/invalid').expect(404);
  });
});