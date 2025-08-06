const Employee = require("../models/Employee");
const RetiredEmployee = require("../models/RetiredEmployee");

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
    const employee = await Employee.findById(req.params.id);
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
