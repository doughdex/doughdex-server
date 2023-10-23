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

        models.Place.getPlaces(page, limit);

        expect(setOffset).toHaveBeenCalledWith(page, limit);
        expect(db.query).toHaveBeenCalled();
    });
  });

  describe('getPlaceById', () => {

    it('should generate and execute a valid query', () => {

          const placeId = '12345';

          models.Place.getPlaceById(placeId);

          expect(db.query).toHaveBeenCalled();
    });
  });
});
