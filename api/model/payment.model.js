const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentUniqueId: { type: String, required: true, unique: true }, // ✅ Enforce uniqueness
  studentName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  receipt_url: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("payments", paymentSchema);
