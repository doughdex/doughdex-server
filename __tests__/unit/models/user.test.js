const { models } = require('../../../models');
const { setOffset } = require('../../../models/helpers');
const db = require('../../../db');
const { server } = require('../../../app');

jest.mock('../../../db', () => ({
  query: jest.fn(),
}));

jest.mock('../../../models/helpers', () => ({
  setOffset: jest.fn().mockReturnValue(0),
}));

let page, limit, mockedQuery;

describe('User Model', () => {
  afterAll(() => {
    server.close();
  });

  describe('getUsers', () => {
    it('should generate and execute a valid query', () => {

      page = 1;
      limit = 5;

      mockedQuery = {
        text: 'SELECT id, name, display_name, email, location, bio, avatar_url, COUNT(*) OVER() as total_count FROM users WHERE is_private = false AND is_banned = false LIMIT $1 OFFSET $2',
        values: [limit, 0]
      };

      models.User.getUsers(page, limit);

      expect(setOffset).toHaveBeenCalledWith(page, limit);
      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });

  });

  describe('getUserById', () => {

    it('should generate and execute a valid query', () => {

      const userId = '12345';

      mockedQuery = {
        text: 'SELECT id, name, display_name, email, location, bio, avatar_url FROM users WHERE id = $1 AND is_banned = false',
        values: [userId]
      };

      models.User.getUserById(userId);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });

  });

  describe('createUser', () => {

    it('should generate and execute a valid query', () => {

      const data = {
        uid: 'abc123',
        name: 'testUser',
        email: 'email@email.com',
      };

      mockedQuery = {
        text: 'INSERT INTO users (name, display_name, email, uid) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [data.name, data.name, data.email, data.uid]
      };

      models.User.createUser(data);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('updateUser', () => {

    it('should generate and execute a valid query', () => {

      const userId = 1;
      const parts = ['name', 'email'];
      const values = ['testUser', 'test@test.com'];

      mockedQuery = {
        text: `UPDATE users SET ${parts.join(', ')} WHERE id = $${values.length + 1}`,
        values: [...values, userId]
      };

      models.User.updateUser(userId, parts, values);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('deleteUser', () => {

    it('should generate and execute a valid query', () => {

      const userId = '12345';

      mockedQuery = {
        text: 'DELETE FROM users WHERE id = $1',
        values: [userId]
      };

      models.User.deleteUser(userId);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });

  });

  describe('getUserLists', () => {

    it('should generate and execute a valid query', () => {

      const userId = '12345';
      page = 1;
      limit = 5;

      mockedQuery = {
        text: 'SELECT l.id AS list_id, l.name AS list_name, lp.place_id, lp.position AS item_position, lp.is_completed AS item_completed, p.name AS place_name, p.address AS place_address, p.city AS place_city, p.state AS place_state, p.loc AS place_loc, p.recommendations AS place_recommendations, p.ratings_counts AS place_ratings_counts, COUNT(*) OVER() as total_count FROM lists as l JOIN list_places AS lp ON l.id = lp.list_id JOIN places AS p ON lp.place_id = p.id WHERE l.user_id = $1 LIMIT $2 OFFSET $3',
        values: [userId, page, 0]
      };

      models.User.getUserLists(userId, page, limit);

      expect(setOffset).toHaveBeenCalledWith(page, limit);
      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });

  });
});