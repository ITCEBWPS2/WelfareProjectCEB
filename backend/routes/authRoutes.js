const express = require("express");
const { loginAdmin, createAdmin } = require ("../controllers/auth.controller");


const router = express.Router();

router.post("/login", loginAdmin);
router.post("/createAdmin", createAdmin);

// router.get("/getUser", getUser);

module.exports = router;