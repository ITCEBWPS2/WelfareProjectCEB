const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const loanSchema = new mongoose.Schema({
  epfNumber: { type: String, required: true },
  name: { type: String, required: true },
  NIC: { type: String, required: true },
  loanAmount: { type: Number, required: true }, // in rupees
  roll: { type: String, required: true },
  reason: { type: String, required: true },
  loanDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }
}, {
  timestamps: true,
});

// Add auto-incremented loanID
loanSchema.plugin(AutoIncrement, { inc_field: 'loanID' });

module.exports = mongoose.model("Loan", loanSchema);
