const express = require("express");
const router = express.Router();

const {
  createScholarship,
  viewScholarships,
  viewScholarshipById,
  updateScholarship,
  deleteScholarship,
  updateScholarshipStatus,
  approveScholarship,
  rejectScholarship,
} = require("../controllers/scholarship.controller");

// Create a new Scholarship
router.post("/createScholarship", createScholarship);

// Get all Scholarships
router.get("/viewScholarships", viewScholarships);

// Get a single Scholarship by ID
router.get("/viewScholarship/:id", viewScholarshipById);


// Get a single Scholarship by ID - approve
router.get("/viewScholarship/:id/approve", approveScholarship);

// Get a single Scholarship by ID -reject
router.get("/viewScholarship/:id/reject", rejectScholarship);

// Update a Scholarship by ID
router.put("/updateScholarship/:id", updateScholarship);

// Delete a Scholarship by ID
router.delete("/deleteScholarship/:id", deleteScholarship);

router.put("/updateStatus/:id", updateScholarshipStatus);

module.exports = router;
