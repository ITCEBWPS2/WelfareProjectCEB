const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
  {
    name: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    // Basic Info
    salutation: { type: String, enum: ["Mr.", "Mrs.", "Ms."], required: true },
    name: { type: String, required: true },
    email: { type: String },
    dateOfBirth: { type: Date },

    // Work Info
    epfNumber: { type: String, required: true, unique: true },
    dateJoined: { type: Date },
    dateRegistered: { type: Date },
    welfareNumber: { type: String, required: true },
    role: { type: String },
    payroll: { type: String },
    division: { type: String },
    branch: { type: String },
    unit: { type: String },
    whatsappNumber: { type: String },
    contactNumber: { type: String },
    retiredDate: { type: Date }, // 👈 added

    // Family Info
    spouse: {
      name: { type: String },
      dateOfBirth: { type: Date },
    },
    children: [childSchema],
    mother: {
      name: { type: String },
      dateOfBirth: { type: Date },
    },
    father: {
      name: { type: String },
      dateOfBirth: { type: Date },
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

// ✅ Fix OverwriteModelError
module.exports =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
