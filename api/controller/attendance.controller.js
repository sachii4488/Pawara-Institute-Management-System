const Attendance = require('../model/attendance.model');
const Class = require('../model/class.model'); // Assuming the Class model exists
const moment = require('moment');

module.exports = {
  markAttendance: async (req, res) => {
    const { studentId, date, status, classId } = req.body;
    const instituteId = req.user.instituteId;

    try {
      const attendance = new Attendance({
        student: studentId,
        date,
        status,
        class: classId,
        institute: instituteId,
      });
      await attendance.save();
      res.status(201).json(attendance);
    } catch (err) {
      console.error('Error marking attendance:', err);
      res.status(500).json({ message: 'Error marking attendance', err });
    }
  },

  getAttendance: async (req, res) => {
    const { studentId } = req.params;

    try {
      const attendance = await Attendance.find({ student: studentId })
        .populate('student', 'name gender guardian_phone') // Populate specific fields for student
        .populate('class', 'class_text'); // Populate class details

      res.status(200).json(attendance);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      res.status(500).json({ message: 'Error fetching attendance', err });
    }
  },

  checkAttendance: async (req, res) => {
    try {
      const today = moment().startOf('day'); // Start of today (00:00:00)

      const attendanceForToday = await Attendance.findOne({
        class: req.params.classId,
        date: {
          $gte: today.toDate(),
          $lt: moment(today).endOf('day').toDate(),
        },
      });

      if (attendanceForToday) {
        return res
          .status(200)
          .json({ attendanceTaken: true, message: 'Attendance already taken for today' });
      } else {
        return res
          .status(200)
          .json({ message: 'No attendance taken yet for today' });
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Fixed `getClassWithId` method to resolve the `StrictPopulateError`
  getClassWithId: async (req, res) => {
    try {
      const { classId } = req.params;
      const classData = await Class.findById(classId)
        .populate({
          path: 'attendee', // Assuming `attendee` is a valid path in the Class schema
          model: 'Student', // Reference to the Student model
          select: 'name age', // Include specific fields for optimization
          options: { strictPopulate: false }, // Override strict populate error
        });

      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }

      res.status(200).json({ success: true, data: classData });
    } catch (err) {
      console.error('Error in getClassWithId:', err);
      res.status(500).json({ message: 'Server error', err });
    }
  },
};
