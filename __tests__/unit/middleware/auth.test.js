const { authenticateRequestor } = require('../../../middleware');
const db = require('../../../db');
const { server } = require('../../../app');

jest.mock('../../../db', () => {
  return {
    query: jest.fn((query) => {
      if (query.values.includes('noUser')) {
        return {
          rows: [],
        };
      } else if (query.values.includes('dbError')) {
        throw new Error('Database error');
      } else {
        return {
          rows: [
            {
              uid: 'uid123',
            },
          ],
        };
      }
    }),
  };
});

describe('authenticateRequestor', () => {

  let consoleError;
  let req;
  let res;
  let next = jest.fn();

  beforeAll(() => {
    consoleError = console.error;
    console.error = jest.fn();
  });

  beforeEach(() => {
    res = {};
    req = {
      headers: {}
    };
    res.json = jest.fn();
    res.status = jest.fn(() => res);
    req.get = jest.fn((header) => req.headers[header]);
  });

  afterAll(() => {
    console.error = consoleError;
    server.close();
  });

  it('should authenticate a user with a valid token', async () => {
    req.headers.Authorization = 'Bearer validToken';

    await authenticateRequestor(req, res, next);

    expect(req.user.uid).toBe('uid123');
    expect(next).toHaveBeenCalled();
  });

  it('should return a 500 status code if provided an invalid token', async () => {
    req.headers.Authorization = 'Bearer invalidToken';

    await authenticateRequestor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user to null if token is not a Bearer token', async () => {
    req.headers.Authorization = 'validToken';

    await authenticateRequestor(req, res, next);

    expect(req.user).toBe(null);
    expect(next).toHaveBeenCalled();
  });

  it('should set req.user to null if there is no Authorization header in request', async () => {

    await authenticateRequestor(req, res, next);

    expect(req.user).toBe(null);
    expect(next).toHaveBeenCalled();
  });

  it('should set req.user to null if no user is returned', async () => {
    req.headers.Authorization = "Bearer noUser";

    await authenticateRequestor(req, res, next);

    expect(req.user).toBe(null);
    expect(next).toHaveBeenCalled();
  });

  it('should return a status code 500 if there is a db query error', async () => {
    req.headers.Authorization = "Bearer dbError";

    await authenticateRequestor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();
  });
});