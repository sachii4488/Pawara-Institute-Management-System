const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { newNotice, fetchAllAudiance, fetchAudiance, deleteNotice, editNotice } = require("../controller/notice.controller");

router.post("/add", authMiddleware(['INSTITUTE']), newNotice);
router.get("/fetch/all",authMiddleware(['INSTITUTE','TEACHER','STUDENT']), fetchAllAudiance)
router.get("/fetch/:audience",authMiddleware(['INSTITUTE','TEACHER','STUDENT']),fetchAudiance);
router.put("/:id",authMiddleware(['INSTITUTE']),editNotice)
router.delete("/:id",authMiddleware(['INSTITUTE']),deleteNotice)
  
module.exports = router;