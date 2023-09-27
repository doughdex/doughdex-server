const { db } = require('../db');
const { setOffset } = require('./helpers');

const getPlaces = (page, limit) => {
  const offset = setOffset(page, limit);
  const query = {
    text: 'SELECT id, google_places_id, name, address, city, state, zip, loc, recommendations, ratings_counts FROM places WHERE is_operational = true AND is_archived = false AND is_approved = true AND flagged = false ORDER BY recommendations DESC LIMIT $1 OFFSET $2',
    values: [limit, offset]
  };

  return db.query(query);

};

const getPlaceById = (id) => {
  const query = {
    text: 'SELECT id, google_places_id, name, address, city, state, zip, loc, recommendations, ratings_counts, is_operational, is_archived, updated_at FROM places WHERE id = $1 AND flagged = false AND is_approved = true',
    values: [id]
  };
  return db.query(query);
};

module.exports = { getPlaces, getPlaceById };