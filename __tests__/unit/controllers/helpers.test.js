const { createPaginationLinks } = require('../../../controllers/helpers');
const { server } = require('../../../app');

describe('createPaginationLinks', () => {

  afterAll(() => {
    server.close();
  });

  it('should generate correct links when provided valid inputs', () => {
    let req = { baseUrl: '/api', path: '/test' }
    let page = 5;
    let limit = 5;
    let totalPages = 10;

    let links =  createPaginationLinks(req, page, limit, totalPages);

    expect(links.first).toBe('http://localhost:3001/api/test?page=1&limit=5');
    expect(links.last).toBe('http://localhost:3001/api/test?page=10&limit=5');
    expect(links.prev).toBe('http://localhost:3001/api/test?page=4&limit=5');
    expect(links.next).toBe('http://localhost:3001/api/test?page=6&limit=5');
  });

  it('should inlucde null previous link when provided page input of 1', () => {
    let req = { baseUrl: '/api', path: '/test' }
    let page = 1;
    let limit = 5;
    let totalPages = 10;

    let links =  createPaginationLinks(req, page, limit, totalPages);

    expect(links.first).toBe('http://localhost:3001/api/test?page=1&limit=5');
    expect(links.last).toBe('http://localhost:3001/api/test?page=10&limit=5');
    expect(links.prev).toBe(null);
    expect(links.next).toBe('http://localhost:3001/api/test?page=2&limit=5');
  });

  it('should include null next link when provided page input equal to total pages', () => {
    let req = { baseUrl: '/api', path: '/test' }
    let page = 10;
    let limit = 5;
    let totalPages = 10;

    let links =  createPaginationLinks(req, page, limit, totalPages);

    expect(links.first).toBe('http://localhost:3001/api/test?page=1&limit=5');
    expect(links.last).toBe('http://localhost:3001/api/test?page=10&limit=5');
    expect(links.prev).toBe('http://localhost:3001/api/test?page=9&limit=5');
    expect(links.next).toBe(null);
  });
});