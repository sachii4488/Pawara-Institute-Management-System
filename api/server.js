require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Stripe = require("stripe");
const Payment = require("./model/payments"); // ✅ Corrected path

// Routers
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
app.use(cors({ exposedHeaders: "Authorization" }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected to Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Stripe Setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Payment Intent Route
app.post("/api/payment/create-payment-intent", async (req, res) => {
  try {
    let { amount, currency } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    amount = Math.round(amount * 100);
    currency = currency || "lkr";

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      expand: ["charges"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Stripe error:", error.message);
    res.status(500).json({ error: "Payment intent creation failed" });
  }
});

// Save Receipt Route
app.post("/api/payment/save-receipt", async (req, res) => {
  try {
    const {
      paymentIntentId,
      amount,
      status,
      receipt_url,
      studentId,
      studentName,
      studentUniqueId,
    } = req.body;

    if (!studentId || !studentName || !studentUniqueId) {
      return res.status(400).json({ error: "Student ID, Name, and Unique ID are required" });
    }

    const newPayment = new Payment({
      paymentIntentId,
      amount,
      status,
      receipt_url,
      studentId,
      studentName,
      studentUniqueId,
    });

    await newPayment.save();
    console.log(`✅ Receipt saved for ${studentName} (${studentId})`); // ✅ Fixed line

    res.status(200).json({ message: "Receipt saved successfully" });
  } catch (err) {
    console.error("❌ Failed to save receipt:", err);
    res.status(500).json({ error: "Failed to save receipt" });
  }
});

// App Routes
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

// Server Start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at port => ${PORT}`);
});
