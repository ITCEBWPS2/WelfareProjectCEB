const express = require('express');
const router = express.Router();
const { createLoan, viewLoans, updateLoanStatus, deleteLoan, viewLoansByStatus } = require('../controllers/loan.controller');

router.post('/createLoan', createLoan);
router.get('/viewLoans', viewLoans);
router.put('/updateStatus/:id', updateLoanStatus);
router.delete('/deleteLoan/:id', deleteLoan);
router.get('/viewLoans/:status', viewLoansByStatus);

module.exports = router;
