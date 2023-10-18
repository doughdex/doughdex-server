const request = require('supertest');
const { testSession } = require('../helpers');
const { server } = require('../../../app');

describe('/api/check', () => {

  afterAll(() => {
    server.close();
  });

  it('returns success', async () => {
    await testSession.get('/api/check').expect(204);
  });
});