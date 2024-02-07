require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createSchema = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE TABLE admins (
      admin_id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE TABLE shops (
      shop_id SERIAL PRIMARY KEY,
      admin_id INTEGER REFERENCES admins(admin_id),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
    );
        `);
    console.log("Schema created successfully.");
  } catch (error) {
    console.error("Error creating schema:", error);
  } finally {
    client.release();
  }
};

createSchema().then(() => process.exit(0));
