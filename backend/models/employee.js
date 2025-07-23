const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
}, { _id: false });

const employeeSchema = new mongoose.Schema(
  {
    // Basic Info
    salutation: { type: String, enum: ['Mr', 'Mrs', 'Ms'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },

    // Work Info
    epfNumber: { type: String, required: true, unique: true },
    dateJoined: { type: Date, required: true },
    dateRegistered: { type: Date, required: true },
    welfareNumber: { type: String, required: true},
    roll: { type: String, required: true },
    payroll: { type: String, required: true },
    division: { type: String, required: true },
    branch: { type: String, required: true },
    unit: { type: String, required: true },
    whatsappNumber: { type: String },
    contactNumber: { type: String, required: true },

    // Family Info
    spouse: {
      name: { type: String },
      dateOfBirth: { type: Date },
    },
    children: [childSchema],

    mother: {
      name: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
    },
    father: {
      name: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
    },
    motherInLaw: {
      name: { type: String },
      dateOfBirth: { type: Date },
    },
    fatherInLaw: {
      name: { type: String },
      dateOfBirth: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
