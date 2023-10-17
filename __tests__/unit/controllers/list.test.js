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

  describe('getLists', () => {

  });

  describe('getListById', () => {

  });

  describe('createList', () => {

  });

  describe('updateList', () => {

  });

  describe('deleteList', () => {

  });

  describe('addSpotToList', () => {

  });

  describe('removeSpotFromList', () => {

  });

  describe('updateSpotInList', () => {

  });
});