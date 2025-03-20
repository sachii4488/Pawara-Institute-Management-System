const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema({
    institute_name:{type:String, required:true},
    email:{ type: String,  required:true },
    owner_name:{type:String, required:true},
    institute_image:{type:String,  required:true},
    createdAt:{type:Date, default: new Date()},

    password:{type:String, required:true}

})

module.exports = mongoose.model("Institute", instituteSchema)