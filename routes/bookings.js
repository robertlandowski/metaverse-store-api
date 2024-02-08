const express = require("express");
const {
  addBooking,
  getBookings,
  updateBooking,
  deleteBooking,
} = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newBooking = await addBooking(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    if (
      error.message === "Business owner not found." ||
      error.message === "Business owner is banned."
    ) {
      return res.status(403).json({ error: error.message });
    }
    if (error.message === "Booking dates overlap with an existing booking.") {
      return res.status(409).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:bookingId", async (req, res) => {
  try {
    const updatedBooking = await updateBooking(req.params.bookingId, req.body); // Expecting { startDate, endDate }
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:bookingId", async (req, res) => {
  try {
    const deletedCount = await deleteBooking(req.params.bookingId);
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
