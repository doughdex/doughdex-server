require('dotenv').config();
const db = require('../db');

const createPaginationLinks = (req, page, limit, totalPages) => {

  const baseUrl = `${process.env.BASE_URL}${req.baseUrl}${req.path}`;

  let links = {};

  if (totalPages === 0) {
    links.first = null;
    links.last = null;
    links.prev = null;
    links.next = null;
  } else {
    links.first = `${baseUrl}?page=1&limit=${limit}`;
    links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
    links.prev = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;
    links.next = page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
  }

  return links;

};

const isUniqueUid = async (value) => {
  const query = {
    text: 'SELECT COUNT(*) FROM users WHERE uid = $1',
    values: [value]
  };

  const result = await db.query(query);

  return result.rows[0].count === '0' ? true : false;
};

const isUniqueEmail = async (value) => {
  const query = {
    text: 'SELECT COUNT(*) FROM users WHERE email = $1',
    values: [value]
  };

  const result = await db.query(query);

  return result.rows[0].count === '0' ? true : false;
};

const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isUserVisible = async (userId) => {
  const query = {
    text: 'SELECT COUNT(*) FROM users WHERE id = $1 AND is_archived = false AND is_banned = false AND is_private = false',
    values: [userId],
  };
  const result = await db.query(query);

  return result.rows[0].count === '1' ? true : false;
};

const isListOwner = async (userId, listId) => {
  const query = {
    text: 'SELECT COUNT(*) FROM lists WHERE id = $1 AND user_id = $2',
    values: [listId, userId],
  }
  const result = await db.query(query);

  return result.rows[0].count === '1' ? true : false;
};

const isUniqueInList = async (listId, placeId) => {
  const query = {
    text: 'SELECT COUNT(*) FROM list_places WHERE list_id = $1 AND place_id = $2',
    values: [listId, placeId],
  }

  const result = await db.query(query);

  return result.rows[0].count === '0' ? true : false;
};

module.exports = {
  createPaginationLinks,
  isUniqueUid,
  isUniqueEmail,
  isValidEmail,
  isUserVisible,
  isListOwner,
  isUniqueInList,
 };