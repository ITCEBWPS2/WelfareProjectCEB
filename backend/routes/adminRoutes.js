const express = require("express");
const router = express.Router();
const { viewAdmin, viewAdminById, deleteAdmin, updateAdmin } = require("../controllers/admin.controller");

router.get("/viewAdmin", viewAdmin);  // Fetch all admins
router.get("/viewAdmin/:id", viewAdminById);  // Fetch single admin by ID
router.delete('/deleteAdmin/:id', deleteAdmin);  // Delete an admin by ID
router.put('/updateAdmin/:id', updateAdmin);  // Update an admin by ID

module.exports = router;
