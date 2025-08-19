// controllers/retirementGiftController.js
const RetirementGift = require("../models/RetirementGift");

// Create a new retirement gift
exports.createRetirementGift = async (req, res) => {
  try {
    const giftData = req.body;

    const newGift = new RetirementGift(giftData);
    await newGift.save();

    res.status(201).json({ message: "Retirement gift created successfully", gift: newGift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all retirement gifts
exports.getAllRetirementGifts = async (req, res) => {
  try {
    const gifts = await RetirementGift.find().sort({ giftID: 1 });
    res.status(200).json(gifts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get a single retirement gift by giftID
exports.getRetirementGiftById = async (req, res) => {
  try {
    const { id } = req.params;
    const gift = await RetirementGift.findOne({ giftID: id });

    if (!gift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    res.status(200).json(gift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update a retirement gift by _id
exports.updateRetirementGift = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGift = await RetirementGift.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedGift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    res.status(200).json({ message: "Gift updated successfully", gift: updatedGift });
  } catch (error) {
    console.error("Error updating retirement gift:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a retirement gift by _id
exports.deleteRetirementGift = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGift = await RetirementGift.findByIdAndDelete(id);

    if (!deletedGift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    res.status(200).json({ message: "Gift deleted successfully" });
  } catch (error) {
    console.error("Error deleting retirement gift:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
