const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "LKR" },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    paymentIntentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
