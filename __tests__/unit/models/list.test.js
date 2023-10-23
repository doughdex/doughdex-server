const db = require('../../../db');
const { models } = require('../../../models');
const { setOffset } = require('../../../models/helpers');
const { server } = require('../../../app');

jest.mock('../../../db', () => ({
  query: jest.fn(),
}));

jest.mock('../../../models/helpers', () => ({
  setOffset: jest.fn().mockReturnValue(0),
}));

let page, limit, mockedQuery;

describe('List Model', () => {

  afterAll(() => {
    server.close();
  });

  describe('getLists', () => {
    it('should generate and execute a valid query', () => {

      page = 1;
      limit = 5;

      models.List.getLists(page, limit);

      expect(setOffset).toHaveBeenCalledWith(page, limit);
      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('getListById', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';

      models.List.getListById(listId);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('createList', () => {
    it('should generate and execute a valid query', () => {

      const userId = '12345';
      const listName = 'testList';

      models.List.createList(userId, listName);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('updateList', () => {
    it('should generate and execute a valid query', () => {
      const listId = 1;
      const parts = ['name = $1'];
      const values = ['testList'];

      models.List.updateList(listId, parts, values);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('deleteList', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';

      models.List.deleteList(listId);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('deleteAllSpotsFromList', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';

      models.List.deleteAllSpotsFromList(listId);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('addSpotToList', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';
      const placeId = '67890';

      models.List.addSpotToList(listId, placeId);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('removeSpotFromList', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';
      const placeId = '67890';

      models.List.removeSpotFromList(listId, placeId);

      expect(db.query).toHaveBeenCalled();
    });
  });
});