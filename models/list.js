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
        l.id,
        l.user_id,
        l.name,
        l.is_ordered,
        l.is_private,
        l.is_flagged,
        l.is_visible,
        l.created_at,
        p.id AS place_id,
        p.google_places_id,
        p.name AS place_name,
        p.address,
        p.city,
        p.state,
        p.zip,
        p.loc,
        p.recommendations,
        p.ratings_counts,
        p.is_operational,
        p.is_archived,
        p.flagged,
        p.created_at AS place_created_at,
        p.updated_at AS place_updated_at,
        p.archived_at AS place_archived_at
      FROM lists AS l
      JOIN list_places AS lp ON l.id = lp.list_id
      JOIN places AS p ON lp.place_id = p.id
      JOIN users AS u ON l.user_id = u.id
      WHERE l.id = $1
        AND l.is_private = false
        AND l.is_flagged = false
        AND u.is_archived = false
        AND u.is_banned = false
        AND u.is_private = false
      ORDER BY lp.position DESC
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

const updateList = (listId, parts, values) => {
  const query = {
    text: `UPDATE lists SET ${parts.join(', ')} WHERE id = $${values.length + 1}`,
    values: [...values, listId]
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