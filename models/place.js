const db = require('../db');
const { setOffset } = require('./helpers');

const getPlaces = (page, limit) => {
  const offset = setOffset(page, limit);
  const query = {
    text: 'SELECT id, google_places_id, name, address, city, state, zip, loc, recommendations, ratings_counts, is_operational, is_archived, is_flagged, is_approved FROM places WHERE is_operational = true AND is_archived = false AND is_approved = true AND is_flagged = false ORDER BY recommendations DESC LIMIT $1 OFFSET $2',
    values: [limit, offset]
  };

  return db.query(query);

};

const getPlaceById = (id) => {
  const query = {
    text: 'SELECT * FROM places WHERE id = $1 AND is_flagged = false AND is_approved = true AND is_archived = false',
    values: [id]
  };
  return db.query(query);
};

module.exports = { getPlaces, getPlaceById };