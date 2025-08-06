// =================== ADMIN CONTROLLER ===================
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const Logger = require("../utils/Logger");


// =================== VIEW ALL ADMINS ===================
exports.viewAdmin = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    res.status(200).json(admins);

    // ✅ Log only after sending the response
    await Logger.info("com.ceb.admin.viewAll", "Viewed all admins", req.user?._id || null, {
      totalAdmins: admins.length,
    }, req);

  } catch (err) {
    await Logger.error("com.ceb.admin.viewAll", "Error fetching admins", req.user?._id || null, {
      error: err.message,
    }, req);
    res.status(500).json({ message: "Error fetching admins", error: err.message });
  }
};

exports.viewAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      await Logger.warn("com.ceb.admin.viewById", "Admin not found", req.user?._id || null, {
        adminId: req.params.id,
      }, req);
      return res.status(404).json({ message: "Admin not found" });
    }

    await Logger.info("com.ceb.admin.viewById", "Viewed admin by ID", req.user?._id || null, {
      adminId: req.params.id,
    }, req);

    res.status(200).json(admin);
  } catch (err) {
    await Logger.error("com.ceb.admin.viewById", "Error fetching admin by ID", req.user?._id || null, {
      adminId: req.params.id,
      error: err.message,
    }, req);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      await Logger.warn("com.ceb.admin.delete", "Admin not found", req.user?._id || null, {
        adminId: req.params.id,
      }, req);
      return res.status(404).json({ message: "Admin not found" });
    }

    await Admin.findByIdAndDelete(req.params.id);

    await Logger.info("com.ceb.admin.delete", "Admin deleted successfully", req.user?._id || null, {
      deletedAdminId: req.params.id,
    }, req);

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    await Logger.error("com.ceb.admin.delete", "Failed to delete admin", req.user?._id || null, {
      adminId: req.params.id,
      error: err.message,
    }, req);
    res.status(500).json({ message: "Failed to delete admin", error: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  const { epfNo, username, role, password } = req.body;

  if (!epfNo || !username) {
    return res.status(400).json({ message: "EPF number and username are required" });
  }

  try {
    const updateData = { epfNo, username, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedAdmin) {
      await Logger.warn("com.ceb.admin.update", "Admin not found", req.user?._id || null, {
        adminId: req.params.id,
      }, req);
      return res.status(404).json({ message: "Admin not found" });
    }

    await Logger.info("com.ceb.admin.update", "Admin updated successfully", req.user?._id || null, {
      adminId: req.params.id,
    }, req);

    res.status(200).json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (err) {
    await Logger.error("com.ceb.admin.update", "Error updating admin", req.user?._id || null, {
      adminId: req.params.id,
      error: err.message,
    }, req);
    res.status(500).json({ message: "Error updating admin", error: err.message });
  }
};