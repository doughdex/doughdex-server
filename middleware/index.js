const { authenticateUser } = require('./auth');
const { isAdmin } = require('./admin');

module.exports = {
  authenticateUser,
  isAdmin,
};