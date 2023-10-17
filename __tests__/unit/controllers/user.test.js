const { server } = require('../../../app');
const { controllers } = require('../../../controllers');
const { models } = require('../../../models')
const { createPaginationLinks } = require('../../../controllers/helpers')

let req, res, consoleError;

jest.mock('../../../models', () => ({
  models: {
    User: {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      getUserLists: jest.fn(),
    },
  },
}));

jest.mock('../../../controllers/helpers', () => ({
  createPaginationLinks: jest.fn().mockReturnValue({}),
}));

describe('getUsers', () => {

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

describe('getUserById', () => {

  beforeAll(() => {
    consoleError = console.error;
    console.error = jest.fn();
  });

  beforeEach(() => {
    req = {
      params: {},
      user: {},
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

      req.params.user_id = 1;

      const mockData = {
        rows: [
          { id: 1, name: 'success', is_private: false }
        ]
      };

      const expectedResponse = mockData.rows[0];

      models.User.getUserById.mockResolvedValueOnce(mockData);

      await controllers.User.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expectedResponse);
  });

  it('should return a 500 status code when error is thrown', async () => {

    const mockError = new Error('Mocked error message');

    models.User.getUserById.mockRejectedValueOnce(mockError);

    await controllers.User.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('should return a 401 status when an unauthorized request is made to a private user', async () => {

    req.params.user_id = 2;
    req.user.id = 1;

    const mockData = {
      rows: [
        { id: 2, name: 'success', is_private: true }
      ]
    };

    models.User.getUserById.mockResolvedValueOnce(mockData);

    await controllers.User.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });

  });

  it('should return a 200 status code if request is made by user with same id as :user_id param', async () => {

    req.params.user_id = 1;
    req.user.id = 1;

    const mockData = {
      rows: [
        { id: 1, name: 'success', is_private: true }
      ]
    };

    models.User.getUserById.mockResolvedValueOnce(mockData);

    await controllers.User.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockData.rows[0]);

  });
});

describe('createUser', () => {

  beforeAll(() => {
    consoleError = console.error;
    console.error = jest.fn();
  });

  beforeEach(() => {
    req = {
      body: {},
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

  it('should return a 201 status code and data upon successful record creation with valid inputs', async () => {

    req.body = {
      uid: 'abcd1234',
      name: 'success',
      email: 'test@test.com'
    }

    const mockData = {
      rows: [
        { id: 1, name: 'success' }
      ]
    };

    models.User.createUser.mockResolvedValueOnce(mockData);
    const expectedResponse = mockData.rows[0];

    await controllers.User.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(expectedResponse);
  });

  it('should return a 500 status code when error is thrown', async () => {

    const mockError = new Error('Mocked error message');

    models.User.createUser.mockRejectedValueOnce(mockError);

    await controllers.User.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });

  });

  it('should return a 400 status code when invalid inputs are provided', async () => {

    req.body = {
      uid: 'abcd1234',
      name: 'success',
    }

    await controllers.User.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
  });

});

describe('updateUser', () => {

});

describe('deleteUser', () => {

});

describe('getUsersLists', () => {

});