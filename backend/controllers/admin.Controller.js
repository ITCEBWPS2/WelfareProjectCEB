const Admin = require("../models/admin");
const bcrypt = require('bcryptjs');

// Get all admins
exports.viewAdmin = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
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
    console.error("Error fetching admin by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete admin', error: err.message });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  const { epfNo, username, role, password } = req.body;

  if (!epfNo || !username) {
    return res.status(400).json({ message: 'EPF number and username are required' });
  }

  try {
    const updateData = { epfNo, username, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error updating admin', error: err.message });
  }
};
