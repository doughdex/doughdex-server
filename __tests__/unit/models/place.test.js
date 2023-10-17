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

describe('Place Model', () => {

  afterAll(() => {
    server.close();
  });

  describe('getPlaces', () => {

    it('should generate and execute a valid query', () => {

        page = 1;
        limit = 5;

        mockedQuery = {
          text: 'SELECT id, google_places_id, name, address, city, state, zip, loc, recommendations, ratings_counts FROM places WHERE is_operational = true AND is_archived = false AND is_approved = true AND flagged = false ORDER BY recommendations DESC LIMIT $1 OFFSET $2',
          values: [limit, 0]
        };

        models.Place.getPlaces(page, limit);

        expect(setOffset).toHaveBeenCalledWith(page, limit);
        expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });

  describe('getPlaceById', () => {

    it('should generate and execute a valid query', () => {

          const placeId = '12345';

          mockedQuery = {
            text: 'SELECT id, google_places_id, name, address, city, state, zip, loc, recommendations, ratings_counts, is_operational, is_archived, updated_at FROM places WHERE id = $1 AND flagged = false AND is_approved = true',
            values: [placeId]
          };

          models.Place.getPlaceById(placeId);

          expect(db.query).toHaveBeenCalledWith(mockedQuery);
    });
  });
});
