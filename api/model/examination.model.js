const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema({
    institute:{type:mongoose.Schema.ObjectId, ref:'Institute'},
    examDate:{type:String,  required:true},
    subject:{type:mongoose.Schema.ObjectId, ref:"Subject"},
    examType:{type:String, required:true},
    status:{type:String, default:'pending'},   
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], 
    createdAt:{type:Date, default: new Date()}

})

module.exports = mongoose.model("Examination", examinationSchema)