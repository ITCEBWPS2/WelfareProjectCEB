const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// models/RetirementGift.js
const retirementGiftSchema = new mongoose.Schema({
  giftID: { type: Number, unique: true },
  epfNumber: { type: String, required: true },
  name: { type: String, required: true },
  dateJoined: { type: Date, required: true },
  dateOfRetire: { type: Date, required: true },
  giftDetails: {
    giftType: { type: String, enum: ["Cash", "Item", "Voucher"], required: true },
    giftDescription: { type: String },
    giftValue: { type: Number, required: true },
    disbursementMethod: { type: String, enum: ["Bank Transfer", "Cheque", "Handed in Ceremony", "Other"], required: true },
    disbursementDate: { type: Date, required: true },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

retirementGiftSchema.plugin(AutoIncrement, { inc_field: "giftID" });

module.exports = mongoose.model("RetirementGift", retirementGiftSchema);
