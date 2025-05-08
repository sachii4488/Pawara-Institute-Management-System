// routes/payment.js
const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment"); // Your Mongoose model

// Save payment receipt to DB
router.post("/save-receipt", async (req, res) => {
    try {
        const { paymentIntentId, amount, status, receipt_url } = req.body;

        const newPayment = new Payment({
            paymentIntentId,
            amount,
            status,
            receipt_url,
        });

        await newPayment.save(); // Save to MongoDB

        res.status(200).json({ message: "Receipt saved successfully" });
    } catch (err) {
        console.error("Error saving receipt:", err);
        res.status(500).json({ error: "Failed to save receipt" });
    }
});

module.exports = router;
