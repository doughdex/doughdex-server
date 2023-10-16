const { server } = require('../../../app');
const { controllers } = require('../../../controllers');
const { models } = require('../../../models')
const { createPaginationLinks } = require('../../../controllers/helpers')

jest.mock('../../../models', () => ({
  models: {
    User: {
      getUsers: jest.fn(),
    },
  },
}));

jest.mock('../../../controllers/helpers', () => ({
  createPaginationLinks: jest.fn().mockReturnValue({}),
}));

describe('getUsers', () => {

  let req = {};
  let res = {};

  beforeAll(() => {
    consoleError = console.error;
    console.error = jest.fn();
  });

  beforeEach(() => {
    req = {
      query: {
        page: 1,
        limit: 10,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterAll(() => {
    console.error = consoleError;
    server.close();
  });

  it('should return a 200 status code and data upon successful operation', async () => {

    const mockData = {
      rows: [
        { id: 1, name: 'success', total_count: 10 }
      ]
    };

    const expectedResponse = {
      page: 1,
      limit: 10,
      totalCount: 10,
      totalPages: 1,
      links: {},
      data: mockData.rows,
    };

    models.User.getUsers.mockResolvedValueOnce(mockData);

    await controllers.User.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expectedResponse);

  });

  it('should return a status code 500 a throw error upon unsuccessful operation', async () => {

    const mockError = new Error('Mocked error message');

    models.User.getUsers.mockRejectedValueOnce(mockError);

    await controllers.User.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('should return a 200 status code with invalid query paramaters', async () => {

    const mockData = {
      rows: [
        { id: 1, name: 'success', total_count: 10 }
      ]
    };

    const expectedResponse = {
      page: 1,
      limit: 10,
      totalCount: 10,
      totalPages: 1,
      links: {},
      data: mockData.rows,
    };

    req.query.page = 'a';
    req.query.limt = 'b';

    models.User.getUsers.mockResolvedValueOnce(mockData);

    await controllers.User.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expectedResponse);
  });

  it('should return a status code 200 with negative query param values', async () => {

    const mockData = {
      rows: [
        { id: 1, name: 'success', total_count: 10 }
      ]
    };

    const expectedResponse = {
      page: 1,
      limit: 10,
      totalCount: 10,
      totalPages: 1,
      links: {},
      data: mockData.rows,
    };

    req.query.page = -1;
    req.query.limt = -2;

    models.User.getUsers.mockResolvedValueOnce(mockData);

    await controllers.User.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expectedResponse);
  });







});

desrcibe('getUserById', () => {

});


