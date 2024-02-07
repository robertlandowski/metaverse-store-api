require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(
      "Connection successful, current time from DB:",
      res.rows[0].now
    );
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
}

testDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
