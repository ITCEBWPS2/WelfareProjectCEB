const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

// Get all admins
exports.viewAdmin = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password'); // Exclude password
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admins", error: err.message });
  }
};

// Get single admin by ID
exports.viewAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin", error: err.message });
  }
};

