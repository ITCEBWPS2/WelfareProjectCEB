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
      loanDate
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
      loanDate
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
    res.status(500).json({ message: "Error fetching loans" });
  }
};
