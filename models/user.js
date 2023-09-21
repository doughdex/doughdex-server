const db = require('../db');
const { setOffset } = require('./helpers');

const getUsers = (page, limit) => {
  const offset = setOffset(page, limit);
  const query = {
    text: 'SELECT id, name, display_name, email, location, bio, avatar_url, COUNT(*) OVER() as total_count FROM users WHERE is_private = false AND is_banned = false LIMIT $1 OFFSET $2',
    values: [limit, offset]
  }

  return db.query(query);
};

const getUserById = (id) => {
  const query = {
    text: 'SELECT id, name, display_name, email, location, bio, avatar_url FROM users WHERE id = $1 AND is_private = false AND is_banned = false',
    values: [id]
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

const updateUser = () => {

};

const deleteUser = () => {

};

const getUserLists = () => {

};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLists
};