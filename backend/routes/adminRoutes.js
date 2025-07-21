const express = require("express");
const router = express.Router();
const { viewAdmin, viewAdminById, deleteAdmin, updateAdmin } = require ("../controllers/admin.Controller");


router.get("/viewAdmin", viewAdmin);
router.get("/viewAdminById", viewAdminById);
router.delete('/deleteAdmin/:id', deleteAdmin);
router.put('/updateAdmin/:id', updateAdmin);

module.exports = router;