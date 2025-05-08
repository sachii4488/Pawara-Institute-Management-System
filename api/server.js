require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Stripe = require("stripe");
const Payment = require("./model/payments"); // Make sure this file exists

// Import routers
const instituteRouter = require("./router/institute.router");
const studentRouter = require("./router/student.router");
const classRouter = require("./router/class.router");
const subjectRouter = require("./router/subject.router");
const teacherRouter = require("./router/teacher.router");
const examRouter = require("./router/examination.router");
const attendanceRoutes = require("./router/attendance.router");
const periodRoutes = require("./router/period.router");
const noticeRoutes = require("./router/notice.router");
const { authCheck } = require("./controller/auth.controller");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = { exposedHeaders: "Authorization" };
app.use(cors(corsOptions));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is connected successfully to Atlas.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route: Create PaymentIntent
app.post("/api/payment/create-payment-intent", async (req, res) => {
  try {
    let { amount, currency } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    amount = Math.round(amount * 100); // convert to cents (smallest unit)
    currency = currency || "lkr";

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      expand: ["charges"], // ensures receipt_url will be available
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: "Payment processing failed" });
  }
});

// Route: Save receipt to MongoDB
app.post("/api/payment/save-receipt", async (req, res) => {
  try {
    console.log("📥 Saving receipt to DB:", req.body); // ✅ LOG

    const { paymentIntentId, amount, status, receipt_url } = req.body;

    const newPayment = new Payment({
      paymentIntentId,
      amount,
      status,
      receipt_url,
    });

    await newPayment.save();
    console.log("✅ Receipt saved successfully");

    res.status(200).json({ message: "Receipt saved successfully" });
  } catch (err) {
    console.error("❌ Error saving receipt:", err);
    res.status(500).json({ error: "Failed to save receipt" });
  }
});

// Other routers
app.use("/api/institute", instituteRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/examination", examRouter);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/period", periodRoutes);
app.use("/api/notices", noticeRoutes);
app.get("/api/auth/check", authCheck);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running at port => ${PORT}`);
});
