const RetiredEmployee = require('../models/RetiredEmployee');
const Employee = require('../models/Employee');

// ✅ Retire employee with custom retired date
exports.retireEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { retiredDate } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const data = employee.toObject();
    delete data._id;

    data.retiredDate = retiredDate || new Date(); // Use provided date, fallback to current

    const retired = new RetiredEmployee(data);
    await retired.save();
    await Employee.findByIdAndDelete(id);

    res.status(200).json({ message: "Employee retired successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error retiring employee", error: error.message });
  }
};

// ✅ View all retired employees
exports.viewRetiredEmployees = async (req, res) => {
  try {
    const retired = await RetiredEmployee.find();
    res.status(200).json(retired);
  } catch (error) {
    res.status(500).json({ message: "Error fetching retired employees", error: error.message });
  }
};

exports.deleteRetiredEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await RetiredEmployee.findByIdAndDelete(id);
    res.status(200).json({ message: "Retired employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting retired employee", error: error.message });
  }
};
