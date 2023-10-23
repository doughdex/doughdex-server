const db = require('../db');
const { setOffset } = require('./helpers');

const getUsers = (page, limit) => {
  const offset = setOffset(page, limit);
  const query = {
    text: 'SELECT id, name, display_name, email, location, bio, avatar_url, timezone, is_private, is_banned, COUNT(*) OVER() as total_count FROM users WHERE is_private = false AND is_banned = false AND is_archived = false LIMIT $1 OFFSET $2',
    values: [limit, offset]
  }

  return db.query(query);
};

const getUserById = (userId) => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1 AND is_banned = false AND is_archived = false',
    values: [userId]
  }
  return db.query(query);
};

const createUser = (data) => {

  const query = {
    text: 'INSERT INTO users (name, display_name, email, uid) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [data.name, data.name, data.email, data.uid]
  }
  return db.query(query);
};

const updateUser = (userId, parts, values) => {
  const query = {
    text: `UPDATE users SET ${parts.join(', ')} WHERE id = $${values.length + 1} RETURNING *`,
    values: [...values, userId]
  };
  return db.query(query);
};

const deleteUser = (userId) => {
  const query = {
    text: 'UPDATE users SET is_archived = true WHERE id = $1',
    values: [userId]
  };
  return db.query(query);
};

const getUserLists = (userId, page, limit, isUser) => {
  const offset = setOffset(page, limit);
  let query;
  if (isUser) {
    query = {
        text: 'SELECT *, COUNT(*) OVER() as total_count FROM lists WHERE lists.user_id = $1 LIMIT $2 OFFSET $3',
        values: [userId, limit, offset]
      };
  } else {
    query = {
      text: 'SELECT lists.*, users.*, COUNT(*) OVER() as total_count FROM lists JOIN users ON lists.user_id = users.id WHERE lists.is_flagged = false AND lists.user_id = $1 LIMIT $2 OFFSET $3',
      values: [userId, limit, offset]
    };
  }
  return db.query(query);
};

const loginUser = (userId) => {
  query = {
    text: 'UPDATE users SET last_login_at = NOW() WHERE id = $1 AND is_archived = false AND is_banned = false RETURNING *',
    values: [userId]
  };
  return db.query(query);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLists,
  loginUser,
};