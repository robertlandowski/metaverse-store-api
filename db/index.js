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
  const bookings_deletion = await pool.query(
    "DELETE FROM bookings WHERE shop_id = $1",
    [shopId]
  );
  const result = await pool.query("DELETE FROM shops WHERE shop_id = $1", [
    shopId,
  ]);
  return result.rowCount;
};

const getShops = async () => {
  const { rows } = await pool.query("SELECT * FROM shops");
  return rows;
};

const addBusinessOwner = async (name, contactInfo) => {
  const { rows } = await pool.query(
    "INSERT INTO business_owners (name, contact_info) VALUES ($1, $2) RETURNING *",
    [name, contactInfo]
  );
  return rows[0];
};

const getBusinessOwners = async () => {
  const { rows } = await pool.query("SELECT * FROM business_owners");
  return rows;
};

const banBusinessOwnerAndUpdateBookings = async (ownerId, isBanned) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateOwnerStatus = await client.query(
      "UPDATE business_owners SET is_banned = $1 WHERE owner_id = $2 RETURNING *",
      [isBanned, ownerId]
    );

    if (isBanned) {
      await client.query("DELETE FROM bookings WHERE owner_id = $1", [ownerId]);
    }

    await client.query("COMMIT");
    return updateOwnerStatus.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const addBooking = async ({ ownerId, shopId, startDate, endDate }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: ownerRows } = await client.query(
      "SELECT is_banned FROM business_owners WHERE owner_id = $1",
      [ownerId]
    );
    if (ownerRows.length === 0) throw new Error("Business owner not found.");
    if (ownerRows[0].is_banned) throw new Error("Business owner is banned.");

    const { rows: bookingRows } = await client.query(
      `SELECT 1 FROM bookings 
       WHERE shop_id = $1 AND NOT (end_date <= $2 OR start_date >= $3)`,
      [shopId, startDate, endDate]
    );
    if (bookingRows.length > 0)
      throw new Error("Booking dates overlap with an existing booking.");

    const { rows: newBookingRows } = await client.query(
      "INSERT INTO bookings (owner_id, shop_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [ownerId, shopId, startDate, endDate]
    );

    await client.query("COMMIT");
    return newBookingRows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getBookings = async () => {
  const { rows } = await pool.query("SELECT * FROM bookings;");
  return rows;
};

const updateBooking = async (bookingId, { startDate, endDate }) => {
  const { rows } = await pool.query(
    `UPDATE bookings
     SET start_date = $2, end_date = $3
     WHERE booking_id = $1
     RETURNING *;`,
    [bookingId, startDate, endDate]
  );
  return rows[0];
};

const deleteBooking = async (bookingId) => {
  const result = await pool.query(
    "DELETE FROM bookings WHERE booking_id = $1;",
    [bookingId]
  );
  return result.rowCount;
};

module.exports = {
  addAdmin,
  getAllAdmins,
  addShop,
  updateShop,
  deleteShop,
  getShops,
  addBusinessOwner,
  getBusinessOwners,
  banBusinessOwnerAndUpdateBookings,
  addBooking,
  getBookings,
  updateBooking,
  deleteBooking,
};
