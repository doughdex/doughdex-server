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

    let testToken;

    it('should return a list and all of its places', async () => {

        const response = await request(app)
          .get('/api/lists/1')
          .expect(200)
          .expect('Content-Type', /json/);

        expect(response.body).toBeTruthy();
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('user_id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('is_private');
        expect(response.body).toHaveProperty('is_ordered');
        expect(response.body).toHaveProperty('is_flagged');
        expect(response.body).toHaveProperty('created_at');
        expect(response.body).toHaveProperty('places');
        expect(response.body.places).toHaveLength(2);
    });

    it('should return a 404 when provided an invalid list id', async () => {
      const response = await request(app)
        .get('/api/lists/a')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'List Not Found' });
    });

    it('should not return a list if the list is private and the requesting user is not the list creator', async () => {
      testToken = 'user2Token';

      const response = await request(app)
        .get('/api/lists/2')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'List Not Found' });
    });

    it('should not return a list if the list creator is private and not the requesting user', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .get('/api/lists/12')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'List Not Found' });
    });

    it('should return a 404 if list is flagged', async () => {

      const response = await request(app)
        .get('/api/lists/20')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'List Not Found' });
    });

    it('should return a 404 if list creator is banned', async () => {

      const response = await request(app)
        .get('/api/lists/3')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'List Not Found' });
    });

    it('should return a 404 if list creator is archived', async () => {

      const response = await request(app)
        .get('/api/lists/4')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'List Not Found' });
    });
  });

  describe('POST /lists', () => {

    let testToken, testList;

    beforeEach(() => {
      testToken = 'user1Token';
    });

    it('should create a new list by an authenticated user', async () => {
      testList = {
        listName: 'Test List'
      };

      const response = await request(app)
        .post('/api/lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send(testList)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('is_private');
      expect(response.body).toHaveProperty('is_ordered');
      expect(response.body).toHaveProperty('is_flagged');
      expect(response.body).toHaveProperty('created_at');
    });

    it('should return a 401 if user is not authenticated', async () => {

      testToken = '';

      testList = {
        listName: 'Test List'
      };

      const response = await request(app)
        .post('/api/lists')
        .send(testList)
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return a 400 if list name is not provided', async () => {

      testList = {
        listName: ''
      };

      const response = await request(app)
        .post('/api/lists')
        .set('Authorization', `Bearer ${testToken}`)
        .send(testList)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Bad Request' });
    });

    it('should return a 400 if no content is provided', async () => {

      const response = await request(app)
        .post('/api/lists')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Bad Request' });
    });
  });

  describe('PUT /lists/:list_id', () => {

    let testToken, testList;

    beforeEach(() => {
      testToken = 'user1Token';
      testList = {
        name: 'Test List',
        is_private: true,
        is_ordered: true
      };
    });

    it('should update a list by an authenticated user', async () => {

      const response = await request(app)
        .put('/api/lists/1')
        .set('Authorization', `Bearer ${testToken}`)
        .send(testList)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('user_id');
      expect(response.body.name).toBe(testList.name);
      expect(response.body.is_private).toBe(testList.is_private);
      expect(response.body.is_ordered).toBe(testList.is_ordered);
    });

    it('should not update a list if the requesting user is not the list creator', async () => {
      testToken = 'user2Token';

      const response = await request(app)
        .put('/api/lists/1')
        .set('Authorization', `Bearer ${testToken}`)
        .send(testList)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'List Not Found' });
    });

    it('should not update a list\'s is_flagged property', async () => {

      testToken = 'user10Token';

      const response = await request(app)
        .put('/api/lists/20')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ is_flagged: false })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Bad Request' });
    });
  });

  describe('DELETE /lists/:list_id', () => {
    let testToken;

    it('should delete a list when the requesting user is the list creator', async () => {
        testToken = 'user1Token';

        const response = await request(app)
          .delete('/api/lists/1')
          .set('Authorization', `Bearer ${testToken}`)
          .expect(204);

        expect(response.body).toEqual({});
    });

    it('should not delete a list when the requesting user is not the list creator', async () => {
      testToken = 'user2Token';

      const response = await request(app)
        .delete('/api/lists/1')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'List Not Found' });
    });


  });

  describe('POST /lists/:list_id/spots', () => {

    let testToken, testSpot;

    it('should add a spot to a list when requesting user is the list creator', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .post('/api/lists/1/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ place_id: '5' })
        .expect(201)
        .expect('Content-Type', /json/);
    });

    it('should not add a spot to a list when requesting user is not the list creator', async () => {
      testToken = 'user2Token';

      const response = await request(app)
        .post('/api/lists/1/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ place_id: '5' })
        .expect(404)
        .expect('Content-Type', /json/);

    });

    it('should return a 404 if the list is not found', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .post('/api/lists/9999/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ place_id: '1' })
        .expect(404)
        .expect('Content-Type', /json/);
    });

    it('should return a 500 if spot is not valid', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .post('/api/lists/1/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ place_id: '9999' })
        .expect(500)
        .expect('Content-Type', /json/);
    });

    it('should return a 400 if the list_id is invalid', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .post('/api/lists/invalid/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ place_id: '1' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Bad Request' });
    });

    it('should return a 400 if there is no requesty body', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .post('/api/lists/1/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Bad Request' });
    });

    it('should return a 400 if there is no place_id in the request body', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .post('/api/lists/1/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ name: 'Test Spot'})
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Bad Request' });
    });

    it('should return a 401 if the user is not authenticated', async () => {
      testToken = '';

      const response = await request(app)
        .post('/api/lists/1/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ place_id: '1' })
        .expect(401)
        .expect('Content-Type', /json/);
    });

    it('should not add a spot to a list if the spot already exists in list', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .post('/api/lists/1/spots')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ place_id: '1' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Bad Request' });
    });
  });

  describe('DELETE /lists/:list_id/spots/:spot_id', () => {

  });
});