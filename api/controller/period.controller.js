const Period = require('../model/period.model');

// Controller to create a period
exports.createPeriod = async (req, res) => {
  try {
    const { teacher, subject, classId, startTime, endTime } = req.body;
    const instituteId = req.user.instituteId;
    const newPeriod = new Period({
       teacher, 
       subject, 
       class: classId, 
       startTime:new Date(startTime),
       endTime:new Date(endTime), 
       institute:instituteId
      });

    await newPeriod.save();
    res.status(201).json({ message: 'Period assigned successfully', period: newPeriod });
  } catch (error) {
    res.status(500).json({ message: 'Error creating period', error });
    console.log("Error", error)
  }
};

// Controller to get periods for a specific teacher
exports.getTeacherPeriods = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    const { teacherId } = req.params;
    const periods = await Period.find({ teacher: teacherId,institute:instituteId }).populate('class').populate('subject');
    res.status(200).json({ periods });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching periods', error });
  }
};

exports.getPeriodsWithId = async (req, res) => {
    try {
      const { id } = req.params;
      const period = await Period.findById(id).populate('class').populate('subject').populate('teacher');
      res.status(200).json({ period });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching periods by id', error });
    }
  };

// Controller to get periods for a specific CLASS
exports.getClassPeriods = async (req, res) => {
  try {
    const { classId } = req.params;
    if (!classId) {
      return res.status(400).json({ message: 'Class ID is missing' });
    }
    const instituteId = req.user.instituteId;
    const periods = await Period.find({ class: classId, institute: instituteId })
      .populate('subject')
      .populate('teacher');
      
    res.status(200).json({ periods });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching periods', error });
  }
};

  // all periods
exports.getPeriods = async (req, res) => {
    try {
      const instituteId = req.user.instituteId;
      const periods = await Period.find({institute:instituteId}).populate('class').populate('subject').populate("teacher")
      res.status(200).json({ periods });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching periods', error });
    }
  };


// Update period
// Update period
exports.updatePeriod = async (req, res) => {
  try {
    const periodId = req.params.id;
    const instituteId = req.user.instituteId;

    // Extract the fields you want to allow updates for
    const { teacher, classId, startTime, endTime } = req.body;

    const updatedPeriod = await Period.findOneAndUpdate(
      { _id: periodId, institute: instituteId },
      {
        teacher,
        class: classId, // store class in the "class" field
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      { new: true } // return the updated doc
    );

    if (!updatedPeriod) {
      return res.status(404).json({
        message: 'Period not found or you are not authorized to update it',
      });
    }

    res.status(200).json({
      message: 'Period updated successfully',
      period: updatedPeriod,
    });
  } catch (error) {
    console.error('Error updating period:', error);
    res.status(500).json({ message: 'Error updating period', error });
  }
};

// Delete period
exports.deletePeriod = async (req, res) => {
  try {
    const periodId = req.params.id;
    await Period.findByIdAndDelete(periodId);
    res.status(200).json({ message: 'Period deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting period', error });
  }
};
