require("dotenv").config();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Class = require("../model/class.model"); 
//const Student = require("../models/student.model");
const QRCode = require("qrcode");

const jwtSecret = process.env.JWTSECRET;

const Student = require("../model/student.model");
const Attendance = require("../model/attendance.model");

module.exports = {
  getStudentWithQuery: async (req, res) => {
    try {
      const filterQuery = {};
      const instituteId = req.user.instituteId;
      filterQuery["institute"] = instituteId;

      if (req.query.hasOwnProperty("search")) {
        filterQuery["name"] = { $regex: req.query.search, $options: "i" };
      }

      if (req.query.hasOwnProperty("student_classes")) {
        filterQuery["student_classes"] = {
          $in: req.query.student_classes.split(","),
        };
      }

      const filteredStudents = await Student.find(filterQuery).populate({
        path: "student_classes",
        select: "class_text", // Fetch class names only
      });

      const studentsWithClassNames = filteredStudents.map((student) => ({
        ...student._doc,
        student_classes: student.student_classes.map((cls) => cls.class_text),
      }));

      res.status(200).json({ success: true, data: studentsWithClassNames });
    } catch (error) {
      console.log("Error in fetching Student with query:", error.message);
      res.status(500).json({
        success: false,
        message: "Error in fetching Student with query.",
      });
    }
  },


 /*registerStudent: async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      try {
        const existingStudent = await Student.findOne({ email: fields.email[0] });
        if (existingStudent) {
          return res.status(400).json({ success: false, message: "Email Already Exist!" });
        }
  
        const photo = files.image[0];
        const oldPath = photo.filepath;
        const originalFileName = photo.originalFilename.replace(" ", "_");
  
        const newPath = path.join(
          __dirname,
          "../../frontend/public/images/uploaded/student",
          originalFileName
        );
        const photoData = fs.readFileSync(oldPath);
        fs.writeFileSync(newPath, photoData);
  
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password[0], salt);
  
        // Map class names to IDs
        const classNames = fields.student_classes[0].split(","); // Assuming comma-separated string
        const classDocs = await Class.find({ class_text: { $in: classNames } });
        const classIds = classDocs.map((cls) => cls._id);
  
        const newStudent = new Student({
          email: fields.email[0],
          name: fields.name[0],
          student_classes: classIds,
          guardian: fields.guardian[0],
          guardian_phone: fields.guardian_phone[0],
          age: fields.age[0],
          gender: fields.gender[0],
          student_image: originalFileName,
          password: hashPassword,
          institute: req.user.id,
        });
  
        const savedData = await newStudent.save();
        res.status(200).json({
          success: true,
          data: savedData,
          message: "Student is Registered Successfully.",
        });
      } catch (error) {
        console.error("ERROR in Register", error);
        res.status(500).json({ success: false, message: "Failed Registration." });
      }
    });
  },*/
  registerStudent: async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      try {
        const existingStudent = await Student.findOne({ email: fields.email[0] });
        if (existingStudent) {
          return res.status(400).json({ success: false, message: "Email Already Exist!" });
        }
    
        const photo = files.image[0];
        const oldPath = photo.filepath;
        const originalFileName = photo.originalFilename.replace(" ", "_");
    
        const newPath = path.join(
          __dirname,
          "../../frontend/public/images/uploaded/student",
          originalFileName
        );
        const photoData = fs.readFileSync(oldPath);
        fs.writeFileSync(newPath, photoData);
    
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password[0], salt);
    
        // Map class names to IDs
        const classNames = fields.student_classes[0].split(","); // Assuming comma-separated string
        const classDocs = await Class.find({ class_text: { $in: classNames } });
        const classIds = classDocs.map((cls) => cls._id);
    
        const newStudent = new Student({
          email: fields.email[0],
          name: fields.name[0],
          student_classes: classIds,
          guardian: fields.guardian[0],
          guardian_phone: fields.guardian_phone[0],
          age: fields.age[0],
          gender: fields.gender[0],
          student_image: originalFileName,
          password: hashPassword,
          institute: req.user.id,
        });
    
        const savedData = await newStudent.save();
        
        // --- Generate Unique ID & QR Code without altering existing functionality ---
        const currentYear = new Date().getFullYear();
        const lastTwoDigits = currentYear.toString().slice(-2);
        // Use countDocuments for a simple sequence per institute (ensure uniqueness)
        const countSoFar = await Student.countDocuments({ institute: req.user.id });
        const paddedSequence = String(countSoFar).padStart(4, "0");
        const uniqueID = `STU/${lastTwoDigits}_${paddedSequence}`;
    
        // Generate QR code (data URL) from the uniqueID using the qrcode package
        const qrDataURL = await QRCode.toDataURL(uniqueID);
    
        // Update the student with unique_id and qr_code
        savedData.unique_id = uniqueID;
        savedData.qr_code = qrDataURL;
        await savedData.save();
        // ---------------------------------------------------------------------------
    
        res.status(200).json({
          success: true,
          data: savedData,
          message: "Student is Registered Successfully.",
        });
      } catch (error) {
        console.error("ERROR in Register", error);
        res.status(500).json({ success: false, message: "Failed Registration." });
      }
    });
  },
  


  loginStudent: async (req, res) => {
    Student.find({ email: req.body.email }).then((resp) => {
      if (resp.length > 0) {
        const isAuth = bcrypt.compareSync(req.body.password, resp[0].password);
        if (isAuth) {
          const token = jwt.sign(
            {
              id: resp[0]._id,
              instituteId: resp[0].institute,
              email: resp[0].email,
              image_url: resp[0].image_url,
              name: resp[0].name,
              role: "STUDENT",
            },
            jwtSecret
          );

          res.header("Authorization", token);

          res.status(200).json({
            success: true,
            message: "Success Login",
            user: {
              id: resp[0]._id,
              email: resp[0].email,
              image_url: resp[0].student_image,
              name: resp[0].name,
              role: "STUDENT",
            },
          });
        } else {
          res
            .status(401)
            .json({ success: false, message: "Password doesn't match." });
        }
      } else {
        res
          .status(401)
          .json({ success: false, message: "Email not registered." });
      }
    });
  },

  getStudentWithId: async (req, res) => {
  const id = req.params.id;
  try {
    // Fetch the student by ID and populate 'student_classes' with 'class_text'
    const student = await Student.findById(id).populate({
      path: "student_classes",
      select: "class_text", // Only return the class_text field
    });

    if (student) {
      // Return the student data with populated classes (class_text)
      res.status(200).json({
        success: true,
        data: {
          ...student._doc,
          student_classes: student.student_classes.map((cls) => cls.class_text),
        },
      });
    } else {
      // If student not found, return 404
      res.status(404).json({ success: false, message: "Student not found." });
    }
  } catch (error) {
    // Handle errors gracefully
    console.log("Error in fetching student by ID:", error.message);
    res.status(500).json({ success: false, message: "Server Error." });
  }
},


  getOwnDetails: async (req, res) => {
    const id = req.user.id;
    const instituteId = req.user.instituteId;
    Student.findOne({ _id: id, institute: instituteId })
      .populate("student_classes")
      .then((resp) => {
        if (resp) {
          res.status(200).json({ success: true, data: resp });
        } else {
          res
            .status(500)
            .json({ success: false, message: "Student data not Available" });
        }
      })
      .catch((e) => {
        console.log("Error in getStudentWithId", e);
        res
          .status(500)
          .json({ success: false, message: "Error in getting Student Data" });
      });
  },

  updateStudentWithId: async (req, res) => {
    const form = new formidable.IncomingForm({
      multiples: false,
      uploadDir: path.join(
        __dirname,
        "../../frontend/public/images/uploaded/student"
      ),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error parsing the form data." });
      }
      try {
        const { id } = req.params;
        const student = await Student.findById(id);

        if (!student) {
          return res.status(404).json({ message: "Student not found." });
        }

        Object.keys(fields).forEach((field) => {
          student[field] = Array.isArray(fields[field])
            ? fields[field][0]
            : fields[field];
        });

        if (files.image) {
          const oldImagePath = path.join(
            __dirname,
            "../../frontend/public/images/uploaded/student",
            student.student_image
          );

          if (student.student_image && fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }

          const originalFileName = path.basename(
            files.image[0].originalFilename.replace(" ", "_")
          );
          const newPath = path.join(
            __dirname,
            "../../frontend/public/images/uploaded/student",
            originalFileName
          );

          fs.copyFileSync(files.image[0].filepath, newPath);
          student.student_image = originalFileName;
        }

        await student.save();
        res
          .status(200)
          .json({ message: "Student updated successfully", data: student });
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error updating student details." });
      }
    });
  },

  deleteStudentWithId: async (req, res) => {
    try {
      const { id } = req.params;
      const instituteId = req.user.instituteId;
      await Attendance.deleteMany({ institute: instituteId, student: id });
      const deletedStudent = await Student.findOneAndDelete({
        _id: id,
        institute: instituteId,
      });
      res.status(200).json({
        success: true,
        message: "Student deleted",
        data: deletedStudent,
      });
    } catch (error) {
      console.log("Error in deleteStudentWithId", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error in deleting Student." });
    }
  },

  signOut: async (req, res) => {
    try {
      res.header("Authorization", "");
      res
        .status(200)
        .json({ success: true, message: "Student Signed Out Successfully." });
    } catch (error) {
      console.log("Error in Sign out", error);
      res
        .status(500)
        .json({ success: false, message: "Server Error in Signing Out." });
    }
  },

  isStudentLoggedIn: async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (token) {
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded) {
          res.status(200).json({
            success: true,
            data: decoded,
            message: "Student is logged in",
          });
        } else {
          res
            .status(401)
            .json({ success: false, message: "You are not Authorized." });
        }
      } else {
        res
          .status(401)
          .json({ success: false, message: "You are not Authorized." });
      }
    } catch (error) {
      console.log("Error in isStudentLoggedIn", error);
      res.status(500).json({ success: false, message: "Server Error." });
    }
  },
};
