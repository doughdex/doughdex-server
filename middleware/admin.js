require('dotenv').config();
const { firebase } = require('../app');
const { getAuth } = require('firebase-admin/auth');
const { getToken, getUserRequestor } = require('./helpers');

const isAdmin = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) { res.status(403).json({ message: 'Unauthorized' }); }
    const decodedToken = await getAuth(firebase).verifyIdToken(token);
    const user = await getUserRequestor(decodedToken);

    if (!user.is_admin) {
      res.status(403).json({ message: 'Unauthorized' });
    } else {
      req.isAdmin = user.is_admin;
      next();
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({ message: 'Internal Server Error'});
  }
};

module.exports = {
  isAdmin,
};