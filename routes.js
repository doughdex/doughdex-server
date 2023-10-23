const router = require('express').Router();
const { controllers } = require('./controllers');
const middleware = require('./middleware');

// User Routes
router.get('/users', controllers.User.getUsers);
router.get('/users/:user_id', controllers.User.getUserById);
router.post('/users', controllers.User.createUser);
router.put('/users/:user_id', (req, res, next) => middleware.validateUserOwnership(req, res, next), controllers.User.updateUser);
router.delete('/users/:user_id', (req, res, next) => middleware.validateUserOwnership(req, res, next), controllers.User.deleteUser);
router.get('/users/:user_id/lists', controllers.User.getUserLists);

// Place Routes
router.get('/places', controllers.Place.getPlaces);
router.get('/places/:place_id', controllers.Place.getPlaceById);

// List Routes
router.get('/lists', controllers.List.getLists);
router.get('/lists/:list_id', (req, res, next) => middleware.validateUserOwnership(req, res, next), controllers.List.getListById);
router.post('/lists', (req, res, next) => middleware.validateUserOwnership(req, res, next), controllers.List.createList);
router.post('/lists/:list_id/spots', (req, res, next) => middleware.validateUserOwnership(req, res, next), controllers.List.addSpotToList);
router.delete('/list/:list_id/', (req, res, next) => middleware.validateUserOwnership(req, res, next), controllers.List.deleteList);
router.delete('/list/:list_id/spots/:spot_id', (req, res, next) => middleware.validateUserOwnership(req, res, next), controllers.List.removeSpotFromList);

// Admin Routes (FUTURE)

// Reviews & Ratings Routes (FUTURE)

// Activity Routes (FUTURE)

// Flags routes (FUTURE)

router.get('/check', (req, res) => {
  res.status(204).end();
});

module.exports = router;