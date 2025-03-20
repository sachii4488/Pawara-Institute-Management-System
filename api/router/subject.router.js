const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { createSubject, getAllSubjects, getSubjectWithId, updateSubjectWithId, deleteSubjectWithId } = require("../controller/subject.controller");

router.post("/create",authMiddleware(['INSTITUTE']), createSubject);
router.get("/fetch-all",authMiddleware(['INSTITUTE']),getAllSubjects);
router.get("/fetch-single/:id",authMiddleware(['INSTITUTE']),  getSubjectWithId);
router.patch("/update/:id",authMiddleware(['INSTITUTE']), updateSubjectWithId);
router.delete("/delete/:id",authMiddleware(['INSTITUTE']), deleteSubjectWithId);

module.exports = router;