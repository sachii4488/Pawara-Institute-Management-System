const express = require("express");
const authMiddleware = require('../auth/auth');
const { getAllInstitutes, updateInstituteWithId,signOut,isInstituteLoggedIn, registerInstitute, loginInstitute, getInstituteOwnData } = require("../controller/institute.controller");

const router = express.Router();

router.post('/register', registerInstitute);
router.get("/all", getAllInstitutes);
router.post("/login", loginInstitute);
router.patch("/update",authMiddleware(['INSTITUTE']), updateInstituteWithId);
router.get("/fetch-single",authMiddleware(['INSTITUTE']),getInstituteOwnData);
router.get("/sign-out", signOut);
router.get("/is-login",  isInstituteLoggedIn)

module.exports = router;