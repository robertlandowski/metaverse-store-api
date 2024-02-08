const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const addAdmin = async (username, email, passwordHash) => {
  const result = await pool.query(
    "INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [username, email, passwordHash]
  );
  return result.rows[0];
};

const getAllAdmins = async () => {
  const result = await pool.query("SELECT * FROM admins");
  return result.rows;
};

const addShop = async (name, description, adminId) => {
  const { rows } = await pool.query(
    "INSERT INTO shops (name, description, admin_id) VALUES ($1, $2, $3) RETURNING *",
    [name, description, adminId]
  );
  return rows[0];
};

const updateShop = async (shopId, name, description) => {
  const { rows } = await pool.query(
    "UPDATE shops SET name = $1, description = $2 WHERE shop_id = $3 RETURNING *",
    [name, description, shopId]
  );
  return rows[0];
};

const deleteShop = async (shopId) => {
  const result = await pool.query("DELETE FROM shops WHERE shop_id = $1", [
    shopId,
  ]);
  return result.rowCount;
};

const getShops = async () => {
  const { rows } = await pool.query("SELECT * FROM shops");
  return rows;
};

module.exports = {
  addAdmin,
  getAllAdmins,
  addShop,
  updateShop,
  deleteShop,
  getShops,
};
