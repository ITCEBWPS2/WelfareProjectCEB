const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Login User
exports.loginAdmin = async (req, res) => {
  console.log("REQ BODY:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in admin", error: err.message });
  }
};

// Create Admin
exports.createAdmin = async (req, res) => {
  const { epfNo, username, password, role } = req.body;

  if (!epfNo || !username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const admin = await Admin.create({ epfNo, username, password, role });

    res.status(201).json({
      id: admin._id,
      epfNo: admin.epfNo,
      username: admin.username,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating admin", error: err.message });
  }
};


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

