const router = require('express').Router();
const { userController, placeController, listController } = require('./controllers');
const middleware = require('./middleware');

// User Routes
router.get('/users', userController.getUsers);
router.get('/users/:user_id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:user_id', (req, res, next) => middleware.authenticateUser(req, res, next), userController.updateUser);
router.delete('/users/:user_id', (req, res, next) => middleware.authenticateUser(req, res, next), userController.deleteUser);
router.get('/users/:user_id/lists', userController.getUserLists);

// Place Routes
router.get('/places', placeController.getPlaces);
router.get('/places/:place_id', placeController.getPlaceById);

// List Routes
router.get('/lists', listController.getLists);
router.get('/lists/:list_id', listController.getListById);
router.post('/lists', (req, res, next) => middleware.authenticateUser(req, res, next), listController.createList);
router.post('/lists/:list_id/spots', (req, res, next) => middleware.authenticateUser(req, res, next), listController.addSpotToList);
router.delete('/list/:list_id/spots/:spot_id', (req, res, next) => middleware.authenticateUser(req, res, next), listController.deleteSpotFromList);

// Admin Routes (FUTURE)

// Reviews & Ratings Routes (FUTURE)

// Activity Routes (FUTURE)

// Flags routes (FUTURE)

module.exports = router;