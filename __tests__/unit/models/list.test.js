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

      mockedQuery = {
        text: 'SELECT id, user_id, name, created_at FROM lists WHERE is_private = false AND is_visible = TRUE AND is_flagged = false ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        values: [limit, 0]
      };

      models.List.getLists(page, limit);

      expect(setOffset).toHaveBeenCalledWith(page, limit);
      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('getListById', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';

      mockedQuery = {
        text: `
          SELECT
            l.id,
            l.user_id,
            l.name,
            l.is_ordered,
            l.is_private,
            l.is_flagged,
            l.is_visible,
            l.created_at,
            p.id AS place_id,
            p.google_places_id,
            p.name AS place_name,
            p.address,
            p.city,
            p.state,
            p.zip,
            p.loc,
            p.recommendations,
            p.ratings_counts,
            p.is_operational,
            p.is_archived,
            p.flagged,
            p.created_at AS place_created_at,
            p.updated_at AS place_updated_at,
            p.archived_at AS place_archived_at
          FROM lists AS l
          JOIN list_places AS lp ON l.id = lp.list_id
          JOIN places AS p ON lp.place_id = p.id
          WHERE l.id = $1
            AND l.is_private = false
            AND l.is_flagged = false
            AND l.is_visible = true
          ORDER BY lp.position DESC
        `,
        values: [listId]
      };

      models.List.getListById(listId);

      expect(db.query).toHaveBeenCalled();
    });
  });

  describe('createList', () => {
    it('should generate and execute a valid query', () => {

      const userId = '12345';
      const listName = 'testList';

      mockedQuery = {
        text: 'INSERT INTO lists (user_id, name) VALUES ($1, $2) RETURNING *',
        values: [userId, listName]
      };

      models.List.createList(userId, listName);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('updateList', () => {
    it('should generate and execute a valid query', () => {
      const listId = 1;
      const parts = ['name = $1'];
      const values = ['testList'];

      mockedQuery = {
        text: `UPDATE lists SET ${parts.join(', ')} WHERE id = $${values.length + 1}`,
        values: [...values, listId]
      };

      models.List.updateList(listId, parts, values);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('deleteList', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';

      mockedQuery = {
        text: 'DELETE FROM lists WHERE id = $1',
        values: [listId]
      };

      models.List.deleteList(listId);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('deleteAllSpotsFromList', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';

      mockedQuery = {
        text: 'DELETE FROM list_places WHERE list_id = $1',
        values: [listId]
      };

      models.List.deleteAllSpotsFromList(listId);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('addSpotToList', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';
      const placeId = '67890';

      mockedQuery = {
        text: 'INSERT INTO list_places (list_id, place_id) VALUES ($1, $2) RETURNING *',
        values: [listId, placeId]
      };

      models.List.addSpotToList(listId, placeId);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('deleteSpotFromList', () => {
    it('should generate and execute a valid query', () => {

      const listId = '12345';
      const placeId = '67890';

      mockedQuery = {
        text: 'DELETE FROM list_places WHERE list_id = $1 AND place_id = $2',
        values: [listId, placeId]
      };

      models.List.deleteSpotFromList(listId, placeId);

      expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });
});