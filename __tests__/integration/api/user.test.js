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

    let updatedser, testToken;

    beforeEach(() => {
      updatedUser = {
        name: 'Updated User',
        display_name: 'Updated User',
        email: 'updated@updated.com',
        location: 'Updated Location',
        timezone: 'Updated Timezone',
        bio: 'Updated Bio',
        avatar_url: 'https://example.com/updated-avatar.png',
        is_private: true,
      }

      testToken = 'user1Token';
    });

    it('should update the user when provided valid inputs', async () => {
      const response = await request(app)
        .put('/api/users/1')
        .send(updatedUser)
        .set({ 'Authorization': `Bearer ${testToken}` })
        .set({'content-type': 'application/json'})
        .expect(200)

      expect(response.body).toBeTruthy();
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('uid');
      expect(response.body.email).toBe(updatedUser.email);
      expect(response.body.name).toBe(updatedUser.name);
      expect(response.body.display_name).toBe(updatedUser.display_name);
      expect(response.body.location).toBe(updatedUser.location);
      expect(response.body.timezone).toBe(updatedUser.timezone);
      expect(response.body.bio).toBe(updatedUser.bio);
      expect(response.body.avatar_url).toBe(updatedUser.avatar_url);
      expect(response.body.is_private).toBe(updatedUser.is_private);
    });

    it('should return a 400 error if the user_id param is invalid', async () => {
      const response = await request(app)
        .put('/api/users/invalid')
        .send(updatedUser)
        .set({ 'Authorization': `Bearer ${testToken}` })
        .set({'content-type': 'application/json'})
        .expect(401)

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should not update the is_admin, is_banned, and uid fields for a user', async () => {
      updatedUser.uid = 'updateduid';
      updatedUser.is_admin = true;

      testToken = 'user2Token';

      const response = await request(app)
        .put('/api/users/2')
        .send(updatedUser)
        .set({ 'Authorization': `Bearer ${testToken}` })
        .set({'content-type': 'application/json'})
        .expect(200)

      expect(response.body).toBeTruthy();
      expect(response.body.uid).not.toBe(updatedUser.uid);
      expect(response.body.is_admin).toBe(false);
    });

    it('should return a 401 error if the user is not the owner', async () => {

      const response = await request(app)
        .put('/api/users/2')
        .send(updatedUser)
        .set({ 'Authorization': `Bearer ${testToken}` })
        .set({'content-type': 'application/json'})
        .expect(401)

      expect(response.body).toEqual({ message: 'Unauthorized' });

    });

    it('should return a 400 error if the email is invalid', async () => {

      updatedUser.email = 'invalidemail';

      const response = await request(app)
        .put('/api/users/1')
        .send(updatedUser)
        .set({ 'Authorization': `Bearer ${testToken}` })
        .set({'content-type': 'application/json'})
        .expect(400)

      expect(response.body).toEqual({ message: 'Invalid email address' });

    });

    it('should return a 400 error if the email is already in use', async () => {

      updatedUser.email = 'jane.doe@example.com';

      const response = await request(app)
        .put('/api/users/1')
        .send(updatedUser)
        .set({ 'Authorization': `Bearer ${testToken}` })
        .set({'content-type': 'application/json'})
        .expect(400)

      expect(response.body).toEqual({ message: 'Email already in use' });

    });

    it('should return a 401 error if the requesting user is banned', async () => {
      testToken = 'user3Token';

      const response = await request(app)
        .put('/api/users/3')
        .send(updatedUser)
        .set({ 'Authorization': `Bearer ${testToken}` })
        .set({'content-type': 'application/json'})
        .expect(401)

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });
  });

  describe('DELETE /users/:user_id', () => {

    let testToken;

    beforeEach(() => {
      testToken = 'user1Token';
    });

    it('should delete a user upon valid request', async () => {
      await request(app)
        .delete('/api/users/1')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(204)
    });

    it('should not delete the user when the requesting user is not the owner', async () => {
      const response = await request(app)
        .delete('/api/users/2')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should return a 401 error if the requesting user is banned', async () => {
      testToken = 'user3Token';

      const response = await request(app)
        .delete('/api/users/3')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should return a 401 error if the requesting user is archived', async () => {
      testToken = 'archivedUserToken';

      const response = await request(app)
        .delete('/api/users/4')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should return a 401 error for an invalid user_id param', async () => {
      const response = await request(app)
        .delete('/api/users/invalid')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });
  });

  describe('GET /users/:user_id/lists', () => {

    let testToken;

<<<<<<< HEAD
    beforeEach(() => {
      testToken = 'user1Token';
    });

    it('should return lists for a user upon valid request', async () => {
      const response = await request(app)
        .get('/api/users/1/lists')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body.data).toBeTruthy();
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('total_count');
      expect(response.body.data.length).toBe(parseInt(response.body.data[0].total_count));
    });

=======
    it('should return lists for a user upon valid request', async () => {
      testToken = 'user1Token';
      const response = await request(app)
        .get('/api/users/1/lists')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body.data).toBeTruthy();
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('total_count');
      expect(response.body.data.length).toBe(parseInt(response.body.data[0].total_count));
    });

>>>>>>> loginuser
    it('should return only public lists for a user if the requesting user is not the owner', async () => {
      testToken = 'user2Token';

      const response = await request(app)
        .get('/api/users/1/lists')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();

      for (const list of response.body.data) {
        expect(list.is_private).toBe(false);
      }
    });

    it('should return a 401 error if the requesting user is banned', async () => {

      testToken = 'user3Token';

      const response = await request(app)
        .get('/api/users/3/lists')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should return a 401 error if the requesting user is archived', async () => {

      testToken = 'archivedUserToken';

      const response = await request(app)
        .get('/api/users/4/lists')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should not return any lists if requestor is not list owner and the list owner is private', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .get('/api/users/2/lists')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(404)

      expect(response.body).toEqual({ message: 'User not found' });
    });
<<<<<<< HEAD
=======
  });

  describe('PUT /users/:user_id/login', () => {

    let testToken;

    it('should update the last_login_at field for a user upon valid request and return user data', async () => {
      testToken = 'user1Token';

      const response = await request(app)
        .put('/api/users/1/login')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body.created_at).not.toBe(response.body.last_login_at);
    });

    it('should return a 401 error if the requesting user is banned', async () => {
      testToken = 'user3Token';

      const response = await request(app)
        .put('/api/users/3/login')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should return a 401 error if the requesting user is archived', async () => {
      testToken = 'archivedUserToken';

      const response = await request(app)
        .put('/api/users/4/login')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should return a 401 error if the requesting user is not the owner', async () => {
      testToken = 'user2Token';

      const response = await request(app)
        .put('/api/users/1/login')
        .set({ 'Authorization': `Bearer ${testToken}` })
        .expect(401)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });
>>>>>>> loginuser
  });
});
