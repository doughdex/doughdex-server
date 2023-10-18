const request = require('supertest');
const { app, server } = require('../../../app');

describe('/api/check', () => {

  afterAll(() => {
    server.close();
  });

  it('returns success', async () => {
    await request(app).get('/api/check').expect(204);
  });
});