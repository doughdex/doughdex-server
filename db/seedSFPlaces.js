require('dotenv').config();
const path = require('path');
const { Pool } = require('pg');
const fs = require('node:fs/promises');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const seedSFPlaces = async () => {
  try {
    const data = await fs.readFile('./clean_pizza_data.json');
    const pizzaData = JSON.parse(data);
    await db.connect();
    await Promise.all()

  } catch (error) {
    console.error('Error seeding initial SF pizza places');
  }


};
