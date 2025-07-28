const express = require("express");
const router = express.Router();
const { retireEmployee, viewRetiredEmployees, deleteRetiredEmployee} = require("../controllers/retire.controller");


router.put('/retireEmployee/:id', retireEmployee);
router.get('/viewRetiredEmployees', viewRetiredEmployees);
router.delete('/deleteRetiredEmployee/:id', deleteRetiredEmployee);

module.exports = router;