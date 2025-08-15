const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const deathFundSchema = new mongoose.Schema(
  {
    deathFundID: {
      type: Number,
      unique: true,
    },
    epfNumber: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    dateOfDeath: {
      type: Date,
      required: true,
    },
    beneficiaryType: {
      type: String,
      enum: ["mother", "father", "mother in law", "father in law", "children"],
      required: true,
    },
    beneficiaryName: {
      type: String,
      required: true,
    },
    fundAmount: {
      type: Number,
      required: true,
    },
    fundDate: {
      type: Date,
      required: true,
    },
    fundType: {
      type: String,
      enum: ["monthly", "one time", "special"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "cheque", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Auto-increment deathFundID
deathFundSchema.plugin(AutoIncrement, { inc_field: "deathFundID" });

module.exports = mongoose.model("DeathFund", deathFundSchema);
