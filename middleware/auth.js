require('dotenv').config();
const { firebase } = require('../app.js');
const { getAuth } = require('firebase-admin/auth');
const { getToken, getUserRequestor } = require('./helpers');

const authenticateUser = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) { res.status(401).json({ message: 'Unauthorized'}); }
    const decodedToken = await getAuth(firebase).verifyIdToken(token);
    const user = await getUserRequestor(decodedToken);

    if (!user) {
      res.status(401).json({ message: 'Unauthorized'});
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { authenticateUser };