const Scholarship = require("../models/scholarship");

// Create
exports.createScholarship = async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);
    await scholarship.save();
    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all
exports.viewScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.status(200).json({ success: true, data: scholarships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get by ID
exports.viewScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update by ID
exports.updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete by ID
exports.deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.status(200).json({ success: true, message: "Scholarship deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update Scholarship status
exports.updateScholarshipStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Approve scholarship
exports.approveScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    if (!scholarship) return res.status(404).json({ message: "Not found" });
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Reject scholarship
exports.rejectScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    if (!scholarship) return res.status(404).json({ message: "Not found" });
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};