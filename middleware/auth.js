require('dotenv').config();
const { initializeApp } = require('firebase-admin/app');
const firebase = initializeApp();
const { getAuth } = require('firebase-admin/auth');
const db = require('../db');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized'});
    }
    const token = authHeader.split(' ')[1];

    const decodeToken = await getAuth().verifyIdToken(token);

    const userQuery = {
      'text': 'SELECT * FROM users WHERE uid = $1',
      'values': [decodeToken.uid],
    };

    const userResult = db.query(userQuery);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized'});
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error decoding token:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { authenticateUser };