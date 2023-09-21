const db = require('../db');
const { setOffset } = require('./helpers');

const getUsers = (page, limit) => {
  const offset = setOffset(page, limit);
  const usersQuery = {
    text: 'SELECT id, name, display_name, email, location, bio, avatar_url, COUNT(*) OVER() as total_count FROM users WHERE is_private = false AND is_banned = false LIMIT $1 OFFSET $2',
    values: [limit, offset]
  }

  return db.query(usersQuery);
};

const getUserById = () => {

};

const createUser = () => {

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