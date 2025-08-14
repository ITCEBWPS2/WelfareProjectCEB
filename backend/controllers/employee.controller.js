const Employee = require("../models/employee");
const RetiredEmployee = require("../models/RetiredEmployee");
const Logger = require("../utils/Logger");

exports.viewEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    // // Commented to avoid duplicate logging due to repeated frontend calls
    // await Logger.info("com.ceb.employee.viewAll", "Viewed all employees", req.user?._id || null, {
    //   totalEmployees: employees.length,
    // }, req);

    res.status(200).json(employees);
  } catch (err) {
    await Logger.error("com.ceb.employee.viewAll", "Error fetching employees", req.user?._id || null, {
      error: err.message,
    }, req);
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};

exports.viewEmployeeById = async (req, res) => {
  try {
    console.log("Fetching employee with ID:", req.params.id);
    const employee = await Employee.findById(req.params.id);
    console.log("Employee found:", employee);
    if (!employee) {
      await Logger.warn("com.ceb.employee.viewById", "Employee not found", req.user?._id || null, {
        employeeId: req.params.id,
      }, req);
      return res.status(404).json({ message: "Employee not found" });
    }

    await Logger.info("com.ceb.employee.viewById", "Viewed employee by ID", req.user?._id || null, {
      employeeId: req.params.id,
    }, req);

    res.status(200).json(employee);
  } catch (err) {
    await Logger.error("com.ceb.employee.viewById", "Error fetching employee", req.user?._id || null, {
      employeeId: req.params.id,
      error: err.message,
    }, req);
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      await Logger.warn("com.ceb.employee.delete", "Employee not found", req.user?._id || null, {
        employeeId: id,
      }, req);
      return res.status(404).json({ message: "Employee not found" });
    }

    await Employee.findByIdAndDelete(id);

    await Logger.info("com.ceb.employee.delete", "Employee deleted successfully", req.user?._id || null, {
      employeeId: id,
    }, req);

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    await Logger.error("com.ceb.employee.delete", "Failed to delete employee", req.user?._id || null, {
      employeeId: id,
      error: err.message,
    }, req);
    res.status(500).json({ message: "Failed to delete employee", error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEmployee) {
      await Logger.warn("com.ceb.employee.update", "Employee not found", req.user?._id || null, {
        employeeId: id,
      }, req);
      return res.status(404).json({ message: "Employee not found" });
    }

    await Logger.info("com.ceb.employee.update", "Employee updated successfully", req.user?._id || null, {
      employeeId: id,
      updatedFields: Object.keys(updateData),
    }, req);

    res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (err) {
    await Logger.error("com.ceb.employee.update", "Error updating employee", req.user?._id || null, {
      employeeId: id,
      error: err.message,
    }, req);
    res.status(500).json({ message: "Error updating employee", error: err.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();

    await Logger.info("com.ceb.employee.create", "Employee created successfully", req.user?._id || null, {
      createdEmployeeId: employee._id,
      epfNo: employee.epfNo,
    }, req);

    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (err) {
    await Logger.error("com.ceb.employee.create", "Error creating employee", req.user?._id || null, {
      error: err.message,
    }, req);
    res.status(400).json({ message: "Error creating employee", error: err.message });
  }
};

exports.retireEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { retiredDate } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      await Logger.warn("com.ceb.employee.retire", "Employee not found", req.user?._id || null, {
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

    await Logger.info("com.ceb.employee.retire", "Employee retired successfully", req.user?._id || null, {
      retiredEmployeeId: id,
      retiredDate: data.retiredDate,
    }, req);

    res.status(200).json({ message: "Employee retired successfully" });
  } catch (err) {
    await Logger.error("com.ceb.employee.retire", "Error retiring employee", req.user?._id || null, {
      employeeId: req.params.id,
      error: err.message,
    }, req);
    res.status(500).json({ message: "Error retiring employee", error: err.message });
  }
};

//search Controller
exports.searchEmployees = async (req, res) => {
  try {
    const { epf } = req.query;
    let query = {};

    if (epf) {
      query.epfNumber = { $regex: `^${epf}`, $options: "i" }; // starts with typed value
    }

    const employees = await Employee.find(query).select("epfNumber name");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getNextWelfareNumber = async (req, res) => {
  try {
    const lastEmployee = await Employee.findOne({})
      .sort({ welfareNumber: -1 }) // sort descending
      .exec();

    let nextNumber = "W00001"; // default if no employee exists

    if (lastEmployee && lastEmployee.welfareNumber) {
      const lastNum = parseInt(lastEmployee.welfareNumber.slice(1), 10);
      const newNum = lastNum + 1;
      nextNumber = "W" + newNum.toString().padStart(5, "0");
    }

    res.status(200).json({ nextWelfareNumber: nextNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
