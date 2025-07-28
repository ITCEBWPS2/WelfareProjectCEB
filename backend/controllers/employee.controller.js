const Employee = require("../models/Employee");
const RetiredEmployee = require('../models/RetiredEmployee'); 

// Get all employees
exports.viewEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err); 
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};

// Get single employee by ID
exports.viewEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
};

// Delete employee by ID
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee", error: err.message });
  }
};

// Update employee by ID
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", error: err.message });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (err) {
    res.status(400).json({ message: "Error creating employee", error: err.message });
  }
};


// Retire an employee by ID
exports.retireEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee by ID
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Create a retired employee with the same data
    const retired = new RetiredEmployee(employee.toObject());
    await retired.save();

    // Remove from active employees
    await Employee.findByIdAndDelete(id);

    res.status(200).json({ message: "Employee retired successfully" });
  } catch (err) {
    console.error("❌ Error retiring employee:", err);  // <== log error to console
    res.status(500).json({ message: "Error retiring employee", error: err.message });
  }
};

