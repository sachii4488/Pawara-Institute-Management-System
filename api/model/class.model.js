const mongoose = require("mongoose");

const asignSubTeachSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.ObjectId, ref: 'Subject' },
  teacher: { type: mongoose.Schema.ObjectId, ref: "Teacher" }
});

const classSchema = new mongoose.Schema({
  institute: { type: mongoose.Schema.ObjectId, ref: 'Institute' },
  class_text: { type: String, required: true },
  class_num: { type: Number, required: true },
  asignSubTeach: [asignSubTeachSchema],
  teacherAttendee: { type: mongoose.Schema.ObjectId, ref: 'Teacher', required: false },
  studentAttendee: [{ type: mongoose.Schema.ObjectId, ref: 'Student', required: false }],
  createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Class", classSchema);
