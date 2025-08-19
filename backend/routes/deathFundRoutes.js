const express = require("express");
const router = express.Router();

const {
  createDeathFund,
  viewDeathFunds,
  viewDeathFundById,
  updateDeathFund,
  deleteDeathFund,
  viewDeathFundsByStatus,
  updateDeathFundStatus
} = require("../controllers/deathFund.controller");

// Create a new Death Fund entry
router.post("/createDeathFund", createDeathFund);

// Get all Death Fund entries
router.get("/viewDeathFunds", viewDeathFunds);

// Get a single Death Fund by ID
router.get("/viewDeathFund/:id", viewDeathFundById);

// // Update a Death Fund by ID
// router.put("/updateDeathFund/:id", updateDeathFund);

// Delete a Death Fund by ID
router.delete("/deleteDeathFund/:id", deleteDeathFund);

// Get Death Fund entries by status (pending, approved, rejected)
router.get("/viewDeathFunds/status/:status", viewDeathFundsByStatus);

// PUT route to update status
router.put("/updateStatus/:id", updateDeathFundStatus);

module.exports = router;
