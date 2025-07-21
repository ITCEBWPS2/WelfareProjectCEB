const express = require("express");
const router = express.Router();
const { loginAdmin, createAdmin } = require ("../controllers/auth.controller");




router.post("/login", loginAdmin);
router.post("/createAdmin", createAdmin);


module.exports = router;