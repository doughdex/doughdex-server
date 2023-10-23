require('dotenv').config();
const { firebase } = require('../app.js');
const { getAuth } = require('firebase-admin/auth');
const { parseToken, getRequestorUserDetails } = require('./helpers');

const authenticateRequestor = async (req, res, next) => {
  const token = parseToken(req);
  try {

    if (!token) {
      req.user = null;
      return next();
    }

    const decodedToken = await getAuth(firebase).verifyIdToken(token);
    const user = await getRequestorUserDetails(decodedToken);

    if (!user) {
      req.user = null;
    } else if (user.is_banned) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    } else {
      req.user = user;
    }

    return next();

  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { authenticateRequestor };