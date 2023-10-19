require('dotenv').config();
process.env.NODE_ENV = 'test';
const path = require('path');
const db = require('../../db');
const fs = require('fs');
const { firebase } = require('../../app.js');
const admin = require('firebase-admin');

const resetDatabase = async () => {
  const schemaSQL = fs.readFileSync(process.env.SCHEMA_PATH).toString();
  await db.query(schemaSQL);
};

const loadUserFixtures = async () => {

  const client = await db.connect();

  try {

    const userFixtures = require(path.join(__dirname, 'fixtures', 'users.json'));

    for (const user of userFixtures) {
      const { uid, name, display_name, email, location, timezone, bio, avatar_url, is_admin, is_banned, is_private } = user;
      const query = `
        INSERT INTO users (uid, name, display_name, email, location, timezone, bio, avatar_url, is_admin, is_banned, is_private)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;

      await client.query(query, [uid, name, display_name, email, location, timezone, bio, avatar_url, is_admin, is_banned, is_private]);
    }
    // const listPlaceFixtures = require(path.join(__dirname, 'fixtures', 'list_places.json'));
  } catch (error) {
    console.error('Error loading user fixtures:', error);
  } finally {
    client.release();
  }
};

const loadPlacesFixtures = async () => {

  const client = await db.connect();

  try {
    const placeFixtures = require(path.join(__dirname, 'fixtures', 'places.json'));

    for (const place of placeFixtures) {
      const { google_places_id, name, address, city, state, zip, loc, recommendations, ratings_counts, is_operational, is_archived, is_approved } = place;

      const query = `
        INSERT INTO places (google_places_id, name, address, city, state, zip, loc, recommendations, ratings_counts, is_operational, is_archived, is_approved)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

      await client.query(query, [google_places_id, name, address, city, state, zip, loc, recommendations, ratings_counts, is_operational, is_archived, is_approved]);
    }
  } catch (error) {
      console.error('Error loading places fixtures:', error);
  } finally {
      client.release();
  }
};

const loadListsFixtures = async () => {

  const client = await db.connect();

  try {

    const listFixtures = require(path.join(__dirname, 'fixtures', 'lists.json'));

    for (const list of listFixtures) {
      const { user_id, name, is_private, is_ordered } = list;

      const query = `
        INSERT INTO lists (user_id, name, is_private, is_ordered)
        VALUES ($1, $2, $3, $4)`;

      await client.query(query, [user_id, name, is_private, is_ordered]);
    }
  } catch (error) {
    console.error('Error loading lists fixtures:', error);
  } finally {
    client.release();
  }
};

const loadListPlacesFixtures = async () => {

  const client = await db.connect();

  try {

    const listPlaceFixtures = require(path.join(__dirname, 'fixtures', 'list_places.json'));

    for (const listPlace of listPlaceFixtures) {
      const { list_id, place_id, is_completed } = listPlace;

      const query = `
        INSERT INTO list_places (list_id, place_id, is_completed)
        VALUES ($1, $2, $3)`;

      await client.query(query, [list_id, place_id, is_completed]);
    }
  } catch (error) {
    console.error('Error loading list_places fixtures:', error);
  } finally {
    client.release();
  }
};

const mintCustomToken = async (uid, email) => {
  const customToken = await admin.auth().createCustomToken(uid, { email });
  const idToken = await admin.auth().verifyIdToken(customToken);
  return customToken;
};

beforeEach(async () => {
  await resetDatabase();
  await loadUserFixtures();
  await loadPlacesFixtures();
  await loadListsFixtures();
  await loadListPlacesFixtures();
});

afterAll(async () => {
  await db.end();
});

module.exports = {
  resetDatabase,
  loadUserFixtures,
  loadPlacesFixtures,
  loadListsFixtures,
  loadListPlacesFixtures,
  mintCustomToken,
}