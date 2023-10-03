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

const getListById = (id) => {
  const query = {
    text: ```
      SELECT
        l.id AS list_id,
        l.user_id,
        l.name AS list_name,
        l.is_ordered,
        l.is_private,
        l.created_at AS list_created_at,
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
        p.is_archived AS place_is_archived,
        p.flagged AS place_flagged,
        p.created_at AS place_created_at,
        p.updated_at AS place_updated_at,
        p.archived_at AS place_archived_at
      FROM lists AS l
      JOIN places AS p ON l.id = p.list_id
      WHERE l.id = $1 AND l.is_private = false AND l.is_flagged = false AND l.is_visible = true;
    ```,
    values: [id]
  }
  return db.query(query);
};

const createList = () => {

};

const updateList = () => {

};

const deleteList = () => {

};

const addSpotToList = () => {

};

const deleteSpotFromList = () => {

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