const express = require("express");
const router = express.Router();
const {
  createRetirementGift,
  getAllRetirementGifts,
  getRetirementGiftById,
  updateRetirementGift,
  deleteRetirementGift
} = require("../controllers/retirementGift.controller");

// Create a new gift
router.post("/createRetirementGift", createRetirementGift);

// Get all gifts
router.get("/viewRetirementGifts", getAllRetirementGifts);

// Get a single gift by giftID
router.get("/viewRetirementGift/:id", getRetirementGiftById);

// Update a gift by giftID
router.put("/updateRetirementGift/:id", updateRetirementGift);

// Delete a gift by giftID
router.delete("/deleteRetirementGift/:id", deleteRetirementGift);

module.exports = router;
