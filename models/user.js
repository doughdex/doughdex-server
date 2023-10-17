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

const getUserById = (userId) => {
  const query = {
    text: 'SELECT id, name, display_name, email, location, bio, avatar_url FROM users WHERE id = $1 AND is_banned = false',
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

const updateUser = (parts, values) => {
  const query = {
    text: `UPDATE users ${parts.join(', ')} WHERE id = $${values.length + 1}`,
    values: values
  };
  return db.query(query);
};

const deleteUser = (userId) => {
  const query = {
    text: 'DELETE FROM users WHERE id = $1',
    values: [userId]
  };
  return db.query(query);
};

const getUserLists = (userId, page, limit) => {
  const offset = setOffset(page, limit);
  const query = {
    text: `SELECT
      l.id AS list_id,
      l.name AS list_name,
      lp.place_id,
      lp.position AS item_position,
      lp.is_completed AS item_completed,
      p.name AS place_name,
      p.address AS place_address,
      p.city AS place_city,
      p.state AS place_state,
      p.loc AS place_loc,
      p.recommendations AS place_recommendations,
      p.ratings_counts AS place_ratings_counts,
      COUNT(*) OVER() as total_count
    FROM
      lists as l
    JOIN
      list_places AS lp ON l.id = lp.list_id
    JOIN
      places AS p ON lp.place_id = p.id
    WHERE
      l.user_id = $1
    LIMIT $2 OFFSET $3`,
    values: [userId, page, offset]
  }
  return db.query(query);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLists
};