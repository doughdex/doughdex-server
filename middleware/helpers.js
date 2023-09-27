const db = require('../db');

const getToken = (req) => {
  const authHeader = req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) { return null; }
  return authHeader.split(' ')[1];
};

const getUserRequestor = async (decodedToken) => {
  const userQuery = {
    'text': 'SELECT * FROM users WHERE uid = $1',
    'values': [decodedToken.uid],
  };

  const userResult = await db.query(userQuery);
  return userResult.rows[0];
};

module.exports = {
  getToken,
  getUserRequestor
}