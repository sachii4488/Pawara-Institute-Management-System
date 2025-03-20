const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { newExamination,  getExaminationByClass, updateExaminaitonWithId, deleteExaminationById, getExaminationById, getAllExaminations} = require("../controller/examination.controller");


router.post("/new", authMiddleware(['INSTITUTE']),newExamination);
router.get("/all", authMiddleware(['INSTITUTE','TEACHER']), getAllExaminations);
router.get("/fetch-class/:classId",authMiddleware(['INSTITUTE','STUDENT','TEACHER']),  getExaminationByClass);
router.get('/single/:id',authMiddleware(['INSTITUTE']), getExaminationById );
router.patch("/update/:id",authMiddleware(['INSTITUTE']), updateExaminaitonWithId);
router.delete("/delete/:id",authMiddleware(['INSTITUTE']),  deleteExaminationById);

module.exports = router;