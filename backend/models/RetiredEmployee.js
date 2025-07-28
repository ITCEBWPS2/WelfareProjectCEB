// models/RetiredEmployee.js
const mongoose = require('mongoose');
const employeeSchema = require('./Employee').schema;

// ✅ Create a new schema by copying the structure
const retiredEmployeeSchema = new mongoose.Schema(employeeSchema.obj, {
  timestamps: true,
});

// ✅ You can also add custom fields if needed (e.g., retiredDate)
retiredEmployeeSchema.add({
  retiredDate: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Create model
const RetiredEmployee = mongoose.model('RetiredEmployee', retiredEmployeeSchema);

module.exports = RetiredEmployee;
