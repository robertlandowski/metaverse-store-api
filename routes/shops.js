const express = require("express");
const router = express.Router();
const { addShop, updateShop, deleteShop, getShops } = require("../db");

router.post("/", async (req, res) => {
  try {
    const { name, description, adminId } = req.body;
    const newShop = await addShop(name, description, adminId);
    res.json(newShop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:shopId", async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedShop = await updateShop(req.params.shopId, name, description);
    res.json(updatedShop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:shopId", async (req, res) => {
  try {
    const deletedCount = await deleteShop(req.params.shopId);
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const shops = await getShops();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
