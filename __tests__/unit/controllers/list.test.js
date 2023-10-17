const { server } = require('../../../app');
const { controllers } = require('../../../controllers');
const { models } = require('../../../models')
const { createPaginationLinks } = require('../../../controllers/helpers')

let req, res, consoleError;

jest.mock('../../../models', () => ({
  models: {
    List: {
      getLists: jest.fn(),
      getListById: jest.fn(),
      createList: jest.fn(),
      updateList: jest.fn(),
      deleteList: jest.fn(),
      deleteAllSpotsFromList: jest.fn(),
      addSpotToList: jest.fn(),
      removeSpotFromList: jest.fn(),
      updateSpotInList: jest.fn(),
    }
  }
}));

jest.mock('../../../controllers/helpers', () => ({
  createPaginationLinks: jest.fn().mockReturnValue({}),
}));

describe('List controller', () => {

  beforeAll(() => {
    consoleError = console.error;
    console.error = () => {};
  });

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      end: jest.fn(),
    };
  });

  afterAll(() => {
    server.close();
    console.error = consoleError;
  });

  describe('getLists', () => {

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

      models.List.getLists.mockResolvedValue(mockData);

      await controllers.List.getLists(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return a 500 status code and error message when an error occurs', async () => {

      models.List.getLists.mockRejectedValue(new Error('Mocked error message'));

      await controllers.List.getLists(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getListById', () => {

    it('should return a 200 status code and data when provided a valid list id', async () => {

      req.params.list_id = 1;

      const mockData = {
        rows: [
          { id: 1, name: 'SF', total_count: 2 },
        ]
      };

      const expectedResponse = mockData.rows[0];

      models.List.getListById.mockResolvedValue(mockData);

      await controllers.List.getListById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return a 500 status code and error message when an error occurs', async () => {

      models.List.getListById.mockRejectedValue(new Error('Mocked error message'));

      await controllers.List.getListById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('createList', () => {

    it('should return a 201 status code and data when provided valid data', async () => {

      req.user.id = 1;
      req.body = {
        listName: 'Test List',
      };

      const mockData = {
        rows: [
          {
            id: 1,
            user_id: 1,
            name: 'Test List',
          }
        ]
      };

      models.List.createList.mockResolvedValue(mockData);

      await controllers.List.createList(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockData.rows[0]);
    });

    it('should return a 500 status code and error message when an error occurs', async () => {

      models.List.createList.mockRejectedValue(new Error('Mocked error message'));

      await controllers.List.createList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('updateList', () => {

    it('should return a 200 status code and data when provided valid data', async () => {

      let parts = ['name = $1'];
      let values = ['Test List'];
      req.params.list_id = 1;

      const mockData = {
        rows: [
          {
            id: 1,
            user_id: 1,
            name: 'Test List',
          }
        ]
      };


      models.List.updateList.mockResolvedValue(mockData);

      await controllers.List.updateList(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockData.rows[0]);
    });

    it('should ignore the is_flagged property', async () => {
      req.body = {
        name: 'Test List',
        is_flagged: false,
      }
      req.params.list_id = 1;

      const mockData = {
        rows: [
          {
            id: 1,
            user_id: 1,
            name: 'Test List',
          }
        ]
      };

      models.List.updateList.mockResolvedValue(mockData);

      await controllers.List.updateList(req, res);

      expect(models.List.updateList).toHaveBeenCalledWith(1, ['name = $1'], ['Test List']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockData.rows[0]);
    });

    it('should return a 500 status code and error message when an error occurs', async () => {

      models.List.updateList.mockRejectedValue(new Error('Mocked error message'));

      await controllers.List.updateList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('deleteList', () => {

    it('should return a 204 status code when provided a valid list id', async () => {

      req.params.list_id = 1;

      await controllers.List.deleteList(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should return a 500 status code and error message when an error occurs', async () => {

      models.List.deleteList.mockRejectedValue(new Error('Mocked error message'));

      await controllers.List.deleteList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('addSpotToList', () => {

    it('should return a 201 status code and data when provided valid data', async () => {
      req.params.list_id = 1;
      req.params.place_id = 2;

      const mockData = {
        rows: [
          {
            list_id: 1,
            place_id: 2,
          }
        ]
      };

      models.List.addSpotToList.mockResolvedValue(mockData);

      await controllers.List.addSpotToList(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockData.rows[0]);
    });

    it('should return a 500 status code and error message when an error occurs', async () => {

      models.List.addSpotToList.mockRejectedValue(new Error('Mocked error message'));

      await controllers.List.addSpotToList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('removeSpotFromList', () => {

    it('should return a 204 status code when provided valid data', async () => {

      req.params.list_id = 1;
      req.params.place_id = 2;

      await controllers.List.removeSpotFromList(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should return a 500 status code and error message when an error occurs', async () => {

      models.List.removeSpotFromList.mockRejectedValue(new Error('Mocked error message'));

      await controllers.List.removeSpotFromList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});