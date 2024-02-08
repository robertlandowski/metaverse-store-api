const express = require("express");
const router = express.Router();
const {
  addBusinessOwner,
  getBusinessOwners,
  banBusinessOwnerAndUpdateBookings,
} = require("../db");

router.post("/", async (req, res) => {
  try {
    const { name, contactInfo } = req.body;
    const newOwner = await addBusinessOwner(name, contactInfo);
    res.status(201).json(newOwner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const owners = await getBusinessOwners();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:ownerId/ban", async (req, res) => {
  const ownerId = req.params.ownerId;
  const { isBanned } = req.body;

  try {
    const updatedOwner = await banBusinessOwnerAndUpdateBookings(
      ownerId,
      isBanned
    );
    if (!updatedOwner) {
      return res.status(404).json({ message: "Business owner not found" });
    }
    res.json(updatedOwner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
