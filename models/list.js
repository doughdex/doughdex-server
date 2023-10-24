const db = require('../db');
const { setOffset } = require('./helpers');

const getLists = (page, limit) => {
  const offset = setOffset(page, limit);
  const query = {
    text: `
      SELECT
        l.*
      FROM lists AS l
      JOIN users AS u ON l.user_id = u.id
      WHERE u.is_archived = false
        AND u.is_banned = false
        AND u.is_private = false
        AND l.is_flagged = false
        AND l.is_private = false
      ORDER BY l.created_at DESC
      LIMIT $1
      OFFSET $2`,
    values: [limit, offset]
  };
  return db.query(query);
};

const getListById = (listId) => {
  const query = {
    text: `
      SELECT
        lists.*,
        JSON_AGG(places.*) AS places
      FROM
        lists
      JOIN
        list_places ON lists.id = list_places.list_id
      JOIN
        places ON list_places.place_id = places.id
      WHERE
        lists.id = $1
      GROUP BY
        lists.id
    `,
    values: [listId]
  }
  return db.query(query);
};

const createList = (userId, listName) => {
  const query = {
    text: 'INSERT INTO lists (user_id, name) VALUES ($1, $2) RETURNING *',
    values: [userId, listName]
  };
  return db.query(query);

};

const updateList = (userId, listId, parts, values) => {
  const query = {
    text: `UPDATE lists SET ${parts.join(', ')} WHERE id = $${values.length + 1} AND user_id = $${values.length + 2} RETURNING *`,
    values: [...values, listId, userId]
  };
  return db.query(query);
};

const deleteList = (listId) => {
  query = {
    text: 'DELETE FROM lists WHERE id = $1',
    values: [listId]
  };
  return db.query(query);
};

const deleteAllSpotsFromList = (listId) => {
  query = {
    text: 'DELETE FROM list_places WHERE list_id = $1',
    values: [listId]
  };
  return db.query(query);
};

const addSpotToList = (listId, placeId) => {
  query = {
    text: 'INSERT INTO list_places (list_id, place_id) VALUES ($1, $2) RETURNING *',
    values: [listId, placeId]
  }
  return db.query(query);
};

const removeSpotFromList = (listId, placeId) => {
  query = {
    text: 'DELETE FROM list_places WHERE list_id = $1 AND place_id = $2',
    values: [listId, placeId]
  };
  return db.query(query);
};

// Todo: Add a function to update the position of a spot in a list

module.exports = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
  addSpotToList,
  deleteAllSpotsFromList,
  removeSpotFromList,
}