const express = require("express");
const { getTeacherWithQuery, loginTeacher,updateTeacherWithId,getTeacherWithId,signOut,isTeacherLoggedIn,  registerTeacher, deleteTeacherWithId ,getTeacherOwnDetails} = require("../controller/teacher.controller");
const router = express.Router();
const authMiddleware = require("../auth/auth");

router.post('/register',authMiddleware(['INSTITUTE']), registerTeacher);
router.get("/fetch-with-query",authMiddleware(['INSTITUTE']),getTeacherWithQuery);
router.post("/login", loginTeacher);
//router.put("/update/:id", authMiddleware(['INSTITUTE']), updateTeacherWithId);
router.patch("/update/:id", authMiddleware(['INSTITUTE']), updateTeacherWithId);

router.get("/fetch-own", authMiddleware(['TEACHER']), getTeacherOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['TEACHER','INSTITUTE']), getTeacherWithId);
router.delete("/delete/:id",authMiddleware(['INSTITUTE']),  deleteTeacherWithId)
// router.get("/sign-out", signOut);
// router.get("/is-login",  isTeacherLoggedIn)

module.exports = router;