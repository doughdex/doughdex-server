const router = require('express').Router();
const { controllers } = require('./controllers');
const { validateUserOwnership, isAuthenticated } = require('./middleware');

// User Routes
router.get('/users', controllers.User.getUsers);
router.get('/users/:user_id', controllers.User.getUserById);
router.post('/users', controllers.User.createUser);
router.put('/users/:user_id', (req, res, next) => isAuthenticated(req, res, next), (req, res, next) => validateUserOwnership(req, res, next), controllers.User.updateUser);
router.put('/users/:user_id/login', controllers.User.loginUser);
router.delete('/users/:user_id', (req, res, next) => isAuthenticated(req, res, next), (req, res, next) => validateUserOwnership(req, res, next), controllers.User.deleteUser);
router.get('/users/:user_id/lists', controllers.User.getUserLists);

// Place Routes
router.get('/places', controllers.Place.getPlaces);
router.get('/places/:place_id', controllers.Place.getPlaceById);
router.get('/places/details/:google_places_id', controllers.Place.getGooglePlacesDetails);

// List Routes
router.get('/lists', controllers.List.getLists);
router.get('/lists/:list_id', controllers.List.getListById);
router.post('/lists', (req, res, next) => isAuthenticated(req, res, next), controllers.List.createList);
router.put('/lists/:list_id', (req, res, next) => isAuthenticated(req, res, next), controllers.List.updateList);
router.post('/lists/:list_id/spots', (req, res, next) => isAuthenticated(req, res, next), controllers.List.addSpotToList);
router.delete('/lists/:list_id', (req, res, next) => isAuthenticated(req, res, next), controllers.List.deleteList);
router.delete('/lists/:list_id/spots/:place_id', (req, res, next) => isAuthenticated(req, res, next), controllers.List.removeSpotFromList);

// Admin Routes (FUTURE)

// Reviews & Ratings Routes (FUTURE)

// Activity Routes (FUTURE)

// Flags routes (FUTURE)

router.get('/check', (req, res) => {
  res.status(204).end();
});

module.exports = router;