const { db } = require('../db');
const { setOffset } = require('./helpers');

const getLists = (page, limit) => {
  const offset = setOffset(page, limit);
  const query = {
    text: 'SELECT id, user_id, name, created_at FROM lists WHERE is_private = false AND is_visible = TRUE AND is_flagged = false ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    values: [limit, offset]
  };
  return db.query(query);
};

const getListById = (listId) => {
  const query = {
    text: ```
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
      WHERE l.id = $1
        AND l.is_private = false
        AND l.is_flagged = false
        AND l.is_visible = true
      ORDER BY lp.position DESC
    ```,
    values: [listId]
  }
  return db.query(query);
};

const createList = (userId, listName) => {
  const query = {
    text: 'INSERT INTO lists (user_id, name) VALUES ($1, $2) RETURNING *',
    values: [userId, name]
  };
  return db.query(query);

};

const updateList = () => {

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

const deleteSpotFromList = (listId, placeId) => {
  query = {
    text: 'DELETE FROM list_places WHERE list_id = $1 AND place_id = $2',
    values: [ilstId, placeId]
  };
  return db.query(query);
};

const updateSpotInList = () => {

};

module.exports = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
  addSpotToList,
  updateSpotInList,
  deleteSpotFromList,
}