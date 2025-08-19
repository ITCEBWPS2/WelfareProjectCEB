const RetiredEmployee = require('../models/RetiredEmployee');
const Employee = require('../models/employee');
const Logger = require('../utils/Logger');

// ✅ Retire employee with custom retired date
exports.retireEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { retiredDate } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      await Logger.warn("com.ceb.retired.retire", "Employee not found for retirement", req.user?._id || null, {
        employeeId: id,
      }, req);
      return res.status(404).json({ message: "Employee not found" });
    }

    const data = employee.toObject();
    delete data._id;
    data.retiredDate = retiredDate || new Date();

    const retired = new RetiredEmployee(data);
    await retired.save();
    await Employee.findByIdAndDelete(id);

    await Logger.info("com.ceb.retired.retire", "Employee retired successfully", req.user?._id || null, {
      retiredEmployeeId: id,
      retiredDate: data.retiredDate,
    }, req);

    res.status(200).json({ message: "Employee retired successfully" });
  } catch (error) {
    await Logger.error("com.ceb.retired.retire", "Error retiring employee", req.user?._id || null, {
      employeeId: req.params.id,
      error: error.message,
    }, req);

    res.status(500).json({ message: "Error retiring employee", error: error.message });
  }
};

// ✅ View all retired employees
exports.viewRetiredEmployees = async (req, res) => {
  try {
    const retired = await RetiredEmployee.find();

    await Logger.info("com.ceb.retired.viewAll", "Viewed all retired employees", req.user?._id || null, {
      totalRetired: retired.length,
    }, req);

    res.status(200).json(retired);
  } catch (error) {
    await Logger.error("com.ceb.retired.viewAll", "Error fetching retired employees", req.user?._id || null, {
      error: error.message,
    }, req);

    res.status(500).json({ message: "Error fetching retired employees", error: error.message });
  }
};

// ✅ Delete retired employee
exports.deleteRetiredEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const retired = await RetiredEmployee.findById(id);
    if (!retired) {
      await Logger.warn("com.ceb.retired.delete", "Retired employee not found", req.user?._id || null, {
        retiredEmployeeId: id,
      }, req);
      return res.status(404).json({ message: "Retired employee not found" });
    }

    await RetiredEmployee.findByIdAndDelete(id);

    await Logger.info("com.ceb.retired.delete", "Deleted retired employee", req.user?._id || null, {
      retiredEmployeeId: id,
    }, req);

    res.status(200).json({ message: "Retired employee deleted successfully" });
  } catch (error) {
    await Logger.error("com.ceb.retired.delete", "Error deleting retired employee", req.user?._id || null, {
      retiredEmployeeId: req.params.id,
      deletedEmployeeData: retired,  // Full snapshot before delete
      error: error.message,
    }, req);

    res.status(500).json({ message: "Error deleting retired employee", error: error.message });
  }
};
