const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

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

// DELETE /api/v1/admin/deleteAdmin/:id
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete admin', error: err.message });
  }
};

//Update Password
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { epfNo, username, password } = req.body;

  if (!epfNo || !username) {
    return res.status(400).json({ message: 'EPF number and username are required' });
  }

  try {
    const updateData = {
      epfNo,
      username,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error updating admin', error: err.message });
  }
}