const { isAdmin, isAuthenticated, validateUserOwnership } = require('../../../middleware');
const { server } = require('../../../app');

describe.only('middleware authorization functions', () => {

  let req;
  let res;
  let next = jest.fn();

  beforeEach(() => {
    res = {};
    req = {};
    res.json = jest.fn();
    res.status = jest.fn(() => res);
  })

  afterAll(() => {
    server.close();
  });

  describe('isAdmin', () => {
    it('should authorize an admin user', () => {
      req.user = {};
      req.user.is_admin = true;

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return a 401 status code for a user that is not an admin', () => {
      req.user = {};
      req.user.is_admin = false;

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 401 status code is no req.user object', () => {
      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should authorize an authenticated user', () => {
      req.user = {};

      isAuthenticated(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return a 401 if no req.user object', () => {

      isAuthenticated(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateUserOwnership', () => {

    it('should authorize an authenticated user that matches user_id param', () => {
      req.params = {};
      req.params.user_id = 1;
      req.user = {};
      req.user.id = 1;

      validateUserOwnership(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return a 401 if req.user.id does not match user_id param', () => {
      req.params = {};
      req.params.user_id = 2;
      req.user = {};
      req.user.id = 1;

      validateUserOwnership(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 401 if no req.user object', () => {

      validateUserOwnership(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

});