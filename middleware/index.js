const { authenticateRequestor } = require('./auth');

const isAuthenticated = (req, res, next) => {

  if (req.user) {
    return next();
  } else {
    res.status(401).json({ message: 'Login required.' });
  }
};

const validateUserOwnership = (req, res, next) => {

  const userId = req.params.user_id;

  if (req.user.id === userId) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.is_admin) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};


module.exports = {
  authenticateRequestor,
  isAuthenticated,
  validateUserOwnership,
  isAdmin
};