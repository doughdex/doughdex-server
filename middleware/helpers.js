const db = require('../db');

const parseToken = (req) => {
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) { return null; }
  return authHeader.split(' ')[1];
};

const getRequestorUserDetails = async (decodedToken) => {
  console.log(decodedToken.uid)
  const userQuery = {
    'text': 'SELECT * FROM users WHERE uid = $1',
    'values': [decodedToken.uid],
  };

  const userResult = await db.query(userQuery);
  return userResult.rows[0];
};

module.exports = {
  parseToken,
  getRequestorUserDetails
}