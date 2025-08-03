const express = require('express');
const router = express.Router();
const { createLoan } = require('../controllers/loan.controller');
const { viewLoans } = require('../controllers/loan.controller');

router.post('/createLoan', createLoan);
router.get('/viewLoans', viewLoans);

module.exports = router;
