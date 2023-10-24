require('dotenv').config();
const path = require('path');
const { Client } = require('pg');
const fs = require('node:fs/promises');
const data = require('./231024_clean_pizza_data.json');

const db = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const seedSFPlaces = async () => {
  try {
    await db.connect();

    await db.query('DELETE FROM places')

    for (const googlePlacesId in data) {
      const { name, business_status, formatted_address, geometry } = data[googlePlacesId];

      const is_operational = business_status === 'OPERATIONAL' ? true : false;

      const addressParts = formatted_address.split(', ');

      const address = addressParts[0];
      const city = 'San Francisco';
      const state = 'CA';
      const zip = formatted_address.match(/\b9\d{4}\b/)[0];

      const loc = `(${geometry.location.lng}, ${geometry.location.lat})`;

      const query = {
        text: 'INSERT INTO places (google_places_id, name, address, city, state, zip, loc, is_operational, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: [googlePlacesId, name, address, city, state, zip, loc, is_operational, true]
      };
      await db.query(query);
    }

  } catch (error) {
    console.error('Error seeding initial SF pizza places', error);
  } finally {
    await db.end();
  }


};

seedSFPlaces();