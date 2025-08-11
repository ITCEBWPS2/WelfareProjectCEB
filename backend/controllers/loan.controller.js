const Loan = require('../models/loan');

// Create a new loan
exports.createLoan = async (req, res) => {
  try {
    const {
      epfNumber,
      name,
      NIC,
      loanAmount,
      role,
      reason,
      loanDate,
    } = req.body;

    if (!epfNumber || !name || !NIC || !loanAmount || !role || !reason || !loanDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLoan = new Loan({
      epfNumber,
      name,
      NIC,
      loanAmount,
      role,
      reason,
      loanDate,
      status:'pending'
    });

    await newLoan.save();

    res.status(201).json({ message: "Loan request created successfully", loan: newLoan });
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(500).json({ message: "Error creating loan", error: error.message });
  }
};

//Get All laons
exports.viewLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    console.error("Error fetching loans:", err);
    res.status(500).json({ message: "Error fetching loans" });
  }
};


// Approve or Reject a Loan
exports.updateLoanStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const loan = await Loan.findByIdAndUpdate(id, { status }, { new: true });
  res.json({ message: "Loan status updated", loan });
};


// Delete Loan
exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    await Loan.findByIdAndDelete(id);
    res.json({ message: "Loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting loan", error: error.message });
  }
};

// Get loans by status
exports.viewLoansByStatus = async (req, res) => {
  const { status } = req.params;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const loans = await Loan.find({ status }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching loans by status" });
  }
};
