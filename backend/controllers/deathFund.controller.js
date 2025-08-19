const DeathFund = require("../models/deathFund");

// Create a new Death Fund entry
exports.createDeathFund = async (req, res) => {
  try {
    // deathFundID is auto-generated, so no need to pass it
    const deathFund = new DeathFund({
      epfNumber: req.body.epfNumber,
      contactNumber: req.body.contactNumber,
      dateOfDeath: req.body.dateOfDeath,
      beneficiaryType: req.body.beneficiaryType,
      beneficiaryName: req.body.beneficiaryName,
      fundAmount: req.body.fundAmount,
      fundDate: req.body.fundDate,
      fundType: req.body.fundType,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "pending",
    });

    const savedDeathFund = await deathFund.save();
    res.status(201).json(savedDeathFund);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create death fund", error: err.message });
  }
};

// Get all Death Fund entries
exports.viewDeathFunds = async (req, res) => {
  try {
    const deathFunds = await DeathFund.find().sort({ deathFundID: 1 });
    res.status(200).json(deathFunds);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch death funds", error: err.message });
  }
};

// Get a single Death Fund by ID
exports.viewDeathFundById = async (req, res) => {
  try {
    const deathFund = await DeathFund.findById(req.params.id);
    if (!deathFund) return res.status(404).json({ message: "Death fund not found" });
    res.status(200).json(deathFund);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch death fund", error: err.message });
  }
};

// Update a Death Fund by ID
// Update only the status of a Death Fund by ID
exports.updateDeathFundStatus = async (req, res) => {
  try {
    const updatedDeathFund = await DeathFund.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedDeathFund) {
      return res.status(404).json({ message: "Death fund not found" });
    }

    res.status(200).json(updatedDeathFund);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};


// Delete a Death Fund by ID
exports.deleteDeathFund = async (req, res) => {
  try {
    const deletedDeathFund = await DeathFund.findByIdAndDelete(req.params.id);
    if (!deletedDeathFund) return res.status(404).json({ message: "Death fund not found" });

    res.status(200).json({ message: "Death fund deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete death fund", error: err.message });
  }
};

// In deathFund.controller.js
exports.viewDeathFundsByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const deathFunds = await DeathFund.find({ status }).sort({ deathFundID: 1 });
    res.status(200).json(deathFunds);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch death funds by status", error: err.message });
  }
};
