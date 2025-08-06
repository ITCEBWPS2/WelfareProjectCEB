const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const Logger = require("../utils/Logger");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// =================== LOGIN ADMIN ===================
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
      await Logger.warn("com.ceb.admin.login", "Invalid credentials", null, {
        username,
      }, req); // ✅ pass req
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);

    await Logger.info("com.ceb.admin.login", "Admin logged in successfully", admin._id, {
      username,
    }, req); // ✅ pass req

    res.status(200).json({
      id: admin._id,
      username: admin.username,
      token,
    });
  } catch (err) {
    await Logger.error("com.ceb.admin.login", "Login failed", null, {
      username,
      error: err.message,
    }, req); // ✅ pass req
    res.status(500).json({ message: "Error logging in admin", error: err.message });
  }
};

// =================== CREATE ADMIN ===================
exports.createAdmin = async (req, res) => {
  const { epfNo, username, password, role } = req.body;

  if (!epfNo || !username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      await Logger.warn("com.ceb.admin.create", "Username already exists", null, {
        username,
      }, req); // ✅ pass req
      return res.status(400).json({ message: "Username already exists" });
    }

    const admin = await Admin.create({ epfNo, username, password, role });

    await Logger.info("com.ceb.admin.create", "Admin created successfully", req.user?._id || null, {
      createdAdminId: admin._id,
      createdUsername: username,
      createdRole: role,
    }, req); // ✅ pass req

    res.status(201).json({
      id: admin._id,
      epfNo: admin.epfNo,
      username: admin.username,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (err) {
    await Logger.error("com.ceb.admin.create", "Error creating admin", null, {
      username,
      error: err.message,
    }, req); // ✅ pass req
    res.status(500).json({ message: "Error creating admin", error: err.message });
  }
};

// =================== VIEW ADMIN BY ID ===================
exports.viewAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      await Logger.warn("com.ceb.admin.viewById", "Admin not found", null, {
        adminId: req.params.id,
      }, req); // ✅ pass req
      return res.status(404).json({ message: "Admin not found" });
    }

    await Logger.info("com.ceb.admin.viewById", "Viewed admin by ID", req.user?._id || null, {
      adminId: req.params.id,
    }, req); // ✅ pass req

    res.status(200).json(admin);
  } catch (err) {
    await Logger.error("com.ceb.admin.viewById", "Error fetching admin by ID", null, {
      adminId: req.params.id,
      error: err.message,
    }, req); // ✅ pass req
    res.status(500).json({ message: "Error fetching admin", error: err.message });
  }
};
