const mongoose = require("mongoose");

const ScholarshipSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    grade: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"], // only these values allowed
      default: "Pending", // default status
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", ScholarshipSchema);
