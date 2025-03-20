/*require("dotenv").config();

const Subject = require("../model/subject.model");
const Exam = require("../model/examination.model");
const Period = require("../model/period.model");
module.exports = {

    getAllSubjects: async(req,res)=>{
         try {
            const instituteId = req.user.instituteId;
            const allSubject= await Subject.find({institute:instituteId});
            res.status(200).json({success:true, message:"Success in fetching all  Subject", data:allSubject})
         } catch (error) {
            console.log("Error in getAllSubject", error);
            res.status(500).json({success:false, message:"Server Error in Getting All Subject. Try later"})
        }

    },
    createSubject: (req, res) => {
                        const instituteId = req.user.instituteId;
                        const newSubject = new Subject({...req.body, institute:instituteId});
                        newSubject.save().then(savedData => {
                            console.log("Date saved", savedData);
                            res.status(200).json({ success: true, data: savedData, message:"Subject is Created Successfully." })
                        }).catch(e => {
                            console.log("ERRORO in Register", e)
                            res.status(500).json({ success: false, message: "Failed Creation of Subject." })
                        })

    },
    getSubjectWithId: async (req, res) => {
        const { id } = req.params;
        const instituteId = req.user.instituteId;
        try {
          const subject = await Subject.findOne({ _id: id, institute: instituteId }).populate("student_classes");
          if (!subject) {
            return res.status(404).json({
              success: false,
              message: "Subject data not available"
            });
          }
          res.status(200).json({
            success: true,
            data: subject
          });
        } catch (error) {
          console.error("Error in getSubjectWithId:", error);
          res.status(500).json({
            success: false,
            message: "Error in getting Subject Data",
            error: error.message  // Return error message to help with debugging
          });
        }
      },
      
    updateSubjectWithId: async(req, res)=>{
    // Not providing the  instituteId as subject Id will be unique.
        try {
            let id = req.params.id;
            console.log(req.body)
            await Subject.findOneAndUpdate({_id:id},{$set:{...req.body}});
            const SubjectAfterUpdate =await Subject.findOne({_id:id});
            res.status(200).json({success:true, message:"Subject Updated", data:SubjectAfterUpdate})
        } catch (error) {
            
            console.log("Error in updateSubjectWithId", error);
            res.status(500).json({success:false, message:"Server Error in Update Subject. Try later"})
        }

    },
    deleteSubjectWithId: async(req, res)=>{
       
        try {
            const instituteId = req.user.instituteId;
            let id = req.params.id;
            const subExamCount = (await Exam.find({subject:id,institute:instituteId})).length;
            const subPeriodCount = (await Period.find({subject:id,institute:instituteId})).length;
            if((subExamCount===0) && (subPeriodCount===0)){
                await Subject.findOneAndDelete({_id:id,institute:instituteId});
                const SubjectAfterDelete = await Subject.findOne({_id:id});
                res.status(200).json({success:true, message:"Subject Deleted.", data:SubjectAfterDelete})
            }else{
                res.status(500).json({success:false, message:"This class is already in use."})
            }

          
        } catch (error) {
            
            console.log("Error in updateSubjectWithId", error);
            res.status(500).json({success:false, message:"Server Error in Deleting Subject. Try later"})
        }

    }
}*/
require("dotenv").config();

const Subject = require("../model/subject.model");
const Exam = require("../model/examination.model");
const Period = require("../model/period.model");

module.exports = {
  // Get all subjects for the current institute
  getAllSubjects: async (req, res) => {
    try {
      const instituteId = req.user.instituteId;
      const allSubject = await Subject.find({ institute: instituteId }).populate("teacher");;
      res.status(200).json({
        success: true,
        message: "Success in fetching all Subjects",
        data: allSubject
      });
    } catch (error) {
      console.log("Error in getAllSubjects:", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Getting All Subjects. Try later"
      });
    }
  },

  // Create a new subject (now including grade and classFee)
  createSubject: (req, res) => {
    const instituteId = req.user.id;
    const newSubject = new Subject({ ...req.body, institute: instituteId });
    newSubject
      .save()
      .then(savedData => {
        console.log("Data saved:", savedData);
        res.status(200).json({
          success: true,
          data: savedData,
          message: "Subject is Created Successfully."
        });
      })
      .catch(e => {
        console.log("Error in createSubject:", e);
        res.status(500).json({
          success: false,
          message: "Failed Creation of Subject."
        });
      });
  },
  

  // Get a single subject by ID (ensuring it belongs to the institute)
  getSubjectWithId: async (req, res) => {
    const { id } = req.params;
    const instituteId = req.user.instituteId;
    try {
      const subject = await Subject.findOne({ _id: id, institute: instituteId }).populate("student_classes");
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject data not available"
        });
      }
      res.status(200).json({
        success: true,
        data: subject
      });
    } catch (error) {
      console.error("Error in getSubjectWithId:", error);
      res.status(500).json({
        success: false,
        message: "Error in getting Subject Data",
        error: error.message
      });
    }
  },

  // Update a subject by ID (now updating grade and classFee as well)
  updateSubjectWithId: async (req, res) => {
    try {
      const id = req.params.id;
      console.log("Update request body:", req.body);
      
      // Use findOneAndUpdate with { new: true } to return the updated document
      const updatedSubject = await Subject.findOneAndUpdate(
        { _id: id, institute: req.user.instituteId },
        { $set: { ...req.body } },
        { new: true }
      );
      
      if (!updatedSubject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Subject Updated",
        data: updatedSubject
      });
    } catch (error) {
      console.log("Error in updateSubjectWithId:", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Updating Subject. Try later",
        error: error.message
      });
    }
  },

  // Delete a subject by ID (only if no related Exams/Periods exist)
  deleteSubjectWithId: async (req, res) => {
    try {
      const instituteId = req.user.instituteId;
      const id = req.params.id;
      const subExamCount = (await Exam.find({ subject: id, institute: instituteId })).length;
      const subPeriodCount = (await Period.find({ subject: id, institute: instituteId })).length;
      
      if (subExamCount === 0 && subPeriodCount === 0) {
        const deletedSubject = await Subject.findOneAndDelete({ _id: id, institute: instituteId });
        if (!deletedSubject) {
          return res.status(404).json({
            success: false,
            message: "Subject not found or already deleted"
          });
        }
        res.status(200).json({
          success: true,
          message: "Subject Deleted.",
          data: deletedSubject
        });
      } else {
        res.status(400).json({
          success: false,
          message: "This subject is already in use."
        });
      }
    } catch (error) {
      console.log("Error in deleteSubjectWithId:", error);
      res.status(500).json({
        success: false,
        message: "Server Error in Deleting Subject. Try later",
        error: error.message
      });
    }
  }
};
