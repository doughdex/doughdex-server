const { server } = require('../../../app');
const { controllers } = require('../../../controllers');
const { models } = require('../../../models')
const { createPaginationLinks } = require('../../../controllers/helpers')

let req, res, consoleError;

jest.mock('../../../models', () => ({
  models: {
    Place: {
      getPlaces: jest.fn(),
      getPlaceById: jest.fn(),
    }
  }
}));

jest.mock('../../../controllers/helpers', () => ({
  createPaginationLinks: jest.fn().mockReturnValue({}),
}));

describe('Place controller', () => {

  beforeAll(() => {
    consoleError = console.error;
    console.error = () => {};
  });

  beforeEach(() => {
    req = {
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterAll(() => {
    server.close();
    console.error = consoleError;
  });

  describe('getPlaces', () => {

    it('should return a 200 status code and data when provided valid query params', async () => {

      req.query.page = 1;
      req.query.limit = 10;

      const mockData = {
        rows: [
          { id: 1, name: 'SF', total_count: 2 },
          { id: 2, name: 'LA', total_count: 2 },
        ]
      };

      const expectedResponse = {
        page: req.query.page,
        limit: req.query.limit,
        totalCount: 2,
        totalPages: 1,
        links: {},
        data: mockData.rows,
      };

      models.Place.getPlaces.mockResolvedValueOnce(mockData);

      await controllers.Place.getPlaces(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return a 500 status code and message when an error occurs', async () => {
      const mockError = new Error('Mocked error message');

      models.Place.getPlaces.mockRejectedValueOnce(mockError);

      await controllers.Place.getPlaces(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getPlaceById', () => {

    it('should return a 200 status code and data when provided a valid place id', async () => {

      req.params.id = 1;

      const mockData = {
        rows: [
          { id: 1, name: 'SF' },
        ]
      };

      models.Place.getPlaceById.mockResolvedValueOnce(mockData);

      await controllers.Place.getPlaceById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockData.rows[0]);
    });

    it('should return a 500 status code and message when an error occurs', async () => {
      const mockError = new Error('Mocked error message');

      models.Place.getPlaceById.mockRejectedValueOnce(mockError);

      await controllers.Place.getPlaceById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});