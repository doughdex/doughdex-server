require('dotenv').config();
const { initializeApp } = require('firebase-admin/app');
const firebase = initializeApp();
const { getAuth } = require('firebase-admin/auth');
const db = require('../db');

const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await getAuth(firebase).verifyIdToken(token);

    const query = {
      text: 'SELECT is_admin FROM users WHERE uid = $1',
      values: [decodedToken.uid]
    };

    const queryResult = await db.query(query);
    const isAdmin = queryResult.rows[0].is_admin;

    req.isAdmin = isAdmin;
    next();
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({ message: 'Internal Server Error'});
  }
};

module.exports = {
  isAdmin,
};