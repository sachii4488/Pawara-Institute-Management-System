const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth')
const { createClass, getAllClass, getClassWithId, updateClassWithId, deleteClassWithId, createSubTeacher, updateSubTeacher, deleteSubTeacherWithId, getAttendeeTeacher } = require("../controller/class.controller");


router.post("/create",authMiddleware(['INSTITUTE']), createClass);
router.get("/fetch-all",authMiddleware(['INSTITUTE','TEACHER','STUDENT']),getAllClass);
router.get("/fetch-single/:id",  getClassWithId);
router.put("/update/:id", authMiddleware(['INSTITUTE']), updateClassWithId);  //patch -> put
router.delete("/delete/:id",authMiddleware(['INSTITUTE']), deleteClassWithId);
// router.post("/sub-teach/new/:id",createSubTeacher );
// router.post("/sub-teach/update/:classId/:subTeachId",updateSubTeacher );
// router.delete("/sub-teach/delete/:classId/:subTeachId",deleteSubTeacherWithId );
router.get("/attendee",authMiddleware(['TEACHER']), getAttendeeTeacher);

module.exports = router;