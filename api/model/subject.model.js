const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    institute:{type:mongoose.Schema.ObjectId, ref:'Institute'},
    subject_name:{type:String, required:true},
    //subject_codename:{type:String,required:true},
    grade:{type:String,required:true},
    classFee:{type:Number,required:true},
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    //teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    student_classes: [{ type: mongoose.Schema.ObjectId, ref: "Class" }],
    createdAt:{type:Date, default:new Date()}

})

module.exports = mongoose.model("Subject", subjectSchema)