require('dotenv').config();
const { firebase } = require('../app.js');
const { getAuth } = require('firebase-admin/auth');
const { parseToken, getRequestorUserDetails } = require('./helpers');

const authenticateRequestor = async (req, res, next) => {
  try {
    const token = parseToken(req);

    if (!token) {
      req.user = null;
      return next();
    }

    const decodedToken = await getAuth(firebase).verifyIdToken(token);
    const user = await getRequestorUserDetails(decodedToken);

    if (!user) {
      req.user = null;
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