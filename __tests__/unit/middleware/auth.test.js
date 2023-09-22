// const jest = require('jest');
const { authenticateUser } = require('../../../middleware');
const db = require('../../../db');

jest.mock('firebase-admin/app', () => {
  return {
    initializeApp: jest.fn()
  };
});

jest.mock('firebase-admin/auth', () => {
  return {
    getAuth: jest.fn(() => {
      return {
        verifyIdToken: jest.fn((token) => {
          if (token === 'validToken') {
            return { uid: 'uid123' };
          } else if (token === 'noUser') {
            return { uid: 'noUser' };
          } else {
            throw new Error('Invalid token');
          }
        }),
      };
    }),
  };
});

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

describe('authenticateUser', () => {

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
    req = { headers: {}};
    req.headers = {};
    res.json = jest.fn();
    res.status = jest.fn(() => res);
  });

  afterAll(() => {
    console.error = consoleError;
  });

  it('should authenticate a user with a valid token', async () => {
    req.headers.Authorization = 'Bearer validToken';

    await authenticateUser(req, res, next);

    expect(req.user.uid).toEqual('uid123');
    expect(next).toHaveBeenCalled();
  });

  it('should return a status code 500 if provided an invalid token', async () => {
    req.headers.Authorization = 'Bearer invalidToken';

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a status code 500 if token is not a Bearer token', async () => {
    req.headers.Authorization = 'validToken';

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a status code 500 if there is no Authorization header in request', async () => {
    req.headers = {};

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a status code 401 if no user is returned', async () => {
    req.headers.Authorization = "Bearer noUser";

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a status code 500 if there is a db query error', async () => {
    req.headers.Authorization = "Bearer dbError";

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();
  });
});