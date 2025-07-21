const express = require("express");
const router = express.Router();
const { viewAdmin, viewAdminById } = require ("../controllers/admin.Controller");




router.get("/viewAdmin", viewAdmin);
router.get("/viewAdminById", viewAdminById);


module.exports = router;