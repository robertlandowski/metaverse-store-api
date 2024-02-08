const express = require("express");
const router = express.Router();
const { addBusinessOwner, getBusinessOwners } = require("../db");

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

module.exports = router;
