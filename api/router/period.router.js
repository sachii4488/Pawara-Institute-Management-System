const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { createPeriod, getTeacherPeriods, getPeriods, getClassPeriods, updatePeriod, deletePeriod, getPeriodsWithId } = require('../controller/period.controller');

router.post('/create',authMiddleware(['INSTITUTE']), createPeriod);
router.get('/all',authMiddleware(['INSTITUTE']), getPeriods)
router.get('/teacher/:teacherId',authMiddleware(['INSTITUTE','TEACHER']), getTeacherPeriods);
router.get('/class/:classId',authMiddleware(['INSTITUTE','STUDENT','TEACHER']), getClassPeriods);
router.get('/:id',authMiddleware(['INSTITUTE']), getPeriodsWithId)
router.put('/update/:id',authMiddleware(['INSTITUTE']),  updatePeriod);
router.delete('/delete/:id',authMiddleware(['INSTITUTE']), deletePeriod);
router.get('/class/:classId',authMiddleware(['INSTITUTE','STUDENT','TEACHER']), getClassPeriods);

module.exports = router;
