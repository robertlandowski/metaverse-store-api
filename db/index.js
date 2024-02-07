const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const addAdmin = async (username, email, passwordHash) => {
  const result = await pool.query(
    "INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [username, email, passwordHash]
  );
  return result.rows[0];
};

module.exports = { addAdmin };
