const express = require("express");
const router = express.Router();
const { createEmployee, viewEmployees, viewEmployeeById, deleteEmployee, updateEmployee } = require("../controllers/employee.controller");


router.post("/createEmployee", createEmployee);
router.get("/viewEmployees", viewEmployees);
router.get("/viewEmployee/:id", viewEmployeeById);
router.delete('/deleteEmployee/:id', deleteEmployee);
router.put('/updateEmployee/:id', updateEmployee);


module.exports = router;