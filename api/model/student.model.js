const mongoose = require("mongoose"); // Add this import

const studentSchema = new mongoose.Schema({
  institute: { type: mongoose.Schema.ObjectId, ref: 'Institute' },
  email: { type: String, required: true },
  name: { type: String, required: true },
  student_classes: [{ type: mongoose.Schema.ObjectId, ref: "Class" }],
  age: { type: String, required: true },
  gender: { type: String, required: true },
  guardian: { type: String, required: true },
  guardian_phone: { type: String, required: true },
  student_image: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  password: { type: String, required: true },
  unique_id: {type: String, unique: true  },
  qr_code: { type: String }
});


module.exports = mongoose.model("Student", studentSchema);
