const express = require("express");
const router = express.Router();
const { addAdmin } = require("../db");

router.post("/register", async (req, res) => {
  try {
    // For demo purposes only, no hashing of the password;
    const { username, email, password } = req.body;
    const newAdmin = await addAdmin(username, email, password);
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Error registering admin:", error.message);
    res.status(500).send("Server error during admin registration.");
  }
});

module.exports = router;
