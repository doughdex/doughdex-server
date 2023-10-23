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

      models.User.getUsers(page, limit);

      expect(setOffset).toHaveBeenCalledWith(page, limit);
      expect(db.query).toHaveBeenCalled();
    });

  });

  describe('getUserById', () => {

    it('should generate and execute a valid query', () => {

      const userId = '12345';

      models.User.getUserById(userId);

      expect(db.query).toHaveBeenCalled();
    });

  });

  describe('createUser', () => {

    it('should generate and execute a valid query', () => {

      const data = {
        uid: 'abc123',
        name: 'testUser',
        email: 'email@email.com',
      };

      models.User.createUser(data);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {

    it('should generate and execute a valid query', () => {

      const userId = 1;
      const parts = ['name', 'email'];
      const values = ['testUser', 'test@test.com'];

      models.User.updateUser(userId, parts, values);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {

    it('should generate and execute a valid query', () => {

      const userId = '12345';

      models.User.deleteUser(userId);

      expect(db.query).toHaveBeenCalled();
    });

  });

  describe('getUserLists', () => {

    it('should generate and execute a valid query', () => {

      const userId = '12345';
      page = 1;
      limit = 5;

      models.User.getUserLists(userId, page, limit);

      expect(setOffset).toHaveBeenCalledWith(page, limit);
      expect(db.query).toHaveBeenCalled();
    });

  });
});