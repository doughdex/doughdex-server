require('dotenv').config();
const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const insertDummyUsers = async (count) => {
  try {
    const client = await pool.connect();
    for (let i = 0; i < count; i++) {
      const display_name = faker.person.firstName();
      const lastName = faker.person.lastName();
      const name = display_name + ' ' + lastName;
      const email = faker.internet.email({ firstName: display_name, lastName: lastName });
      const location = faker.location.city() + ', ' + faker.location.state({ abbreviated: true });
      const timezone = faker.location.timeZone();
      const bio = faker.person.bio();
      const avatarUrl = faker.image.avatar();
      const isPrivate = faker.datatype.boolean({ probability: 0.25 });

      const query = {
        text: `INSERT INTO users (name, display_name, email, location, timezone, bio, avatar_url, is_private)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        values: [name, display_name, email, location, timezone, bio, avatarUrl, isPrivate],
      };

      await client.query(query);
    }
    client.release();
    console.log(`${count} users inserted successfully.`);
  } catch (err) {
    console.error('Error inserting users:', err);
  }
};

insertDummyUsers(100);
