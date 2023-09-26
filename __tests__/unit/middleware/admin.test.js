const { isAdmin } = require('../../../middleware');
const db = require('../../../db');
const { server } = require('../../../app');

/**
 * Unit Tests:
 * [ ] valid bearer token for admin
 * [ ] valid bearer token for non-admin
 * [ ] invalid bearer token
 * [ ] valid token but not bearer
 * [ ] no auth header
 * [ ] no user returned
 * [ ] db query error
 */

/**
 * Functions to mock:
 * [ ] firebase-admin/auth getAuth().verifyIdToken()
 * [ ] db.query
 */

jest.mock('firebase-admin/auth', () => {
  return {
    getAuth: jest.fn(() => {
      return {
        verifyIdToken: jest.fn((token) => {
          if (token === 'validAdminToken') {
            return { uid: 'isAdmin' };
          } else if (token === 'notAnAdminToken') {
            return { uid: 'notAdmin' };
          } else if (token === 'dbError') {
            return { uid: 'dbError' };
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
      if (query.values.includes('isAdmin')) {
        return {
          rows: [
            {
              uid: 'isAdmin', is_admin: true,
            }
          ],
        };
      } else if (query.values.includes('notAdmin')) {
        return {
          rows: [
            {
              uid: 'notAdmin', is_admin: false,
            },
          ],
        };
      } else if (query.values.includes('dbError')) {
        throw new Error('Database error');
      } else {
        return {
          rows: [
            {},
          ],
        };
      }
    }),
  };
});

describe('isAdmin', () => {

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
    req.isAdmin = undefined;
    res.json = jest.fn();
    res.status = jest.fn(() => res);
  });

  afterAll(() => {
    console.error = consoleError;
    server.close();
  });

  it('should authenticate/authorize a user with admin privileges', async () => {
    req.headers.Authorization = 'Bearer validAdminToken';

    await isAdmin(req, res, next);

    expect(req.isAdmin).toBe(true);
    expect(next).toHaveBeenCalled();
  });

  it('should return a status code 403 status code for a user without admin privileges', async () => {
    req.headers.Authorization = 'Bearer notAnAdminToken';

    await isAdmin(req, res, next);

    expect(req.isAdmin).toBe(undefined);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a 500 status code with an invalid token', async () => {
    req.headers.Authorization = 'Bearer invalidToken';

    await isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a 403 status code with a non-bearer token', async () => {
    req.headers.Authorization = 'validAdminToken';

    await isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();

  });

  it('should return a 403 status code with no Authorization header present', async () => {

    await isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();

  });

  it('should return a 403 status code if no user is returned from db query', async () => {
    req.headers.Authorization = "Bearer noUser";

    await isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();

  });

  it('should return a 500 status code if db query error', async () => {
    req.headers.Authorization = "Bearer dbError";

    await isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    expect(req.user).toBe(undefined);
    expect(next).not.toHaveBeenCalled();
  });
});