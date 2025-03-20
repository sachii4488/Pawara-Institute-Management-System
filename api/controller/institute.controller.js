require("dotenv").config();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWTSECRET;

const Institute = require("../model/institute.model");
module.exports = {

    getAllInstitutes: async(req,res)=>{
         try {
            const institutes= await Institute.find().select(['-_id','-password','-email','-owner_name','-createdAt']);
            res.status(200).json({success:true, message:"Success in fetching all  Institutes", data:institutes})
         } catch (error) {
            console.log("Error in getAllInstitutes", error);
            res.status(500).json({success:false, message:"Server Error in Getting All Institutes. Try later"})
        }

    },
    registerInstitute: async (req, res) => {
        const form = new formidable.IncomingForm();
    
        form.parse(req, (err, fields, files) => {
            console.log(fields, "fields");
            Institute.find({ email: fields.email }).then(resp => {
                if (resp.length > 0) {
                    res.status(500).json({ success: false, message: "Email Already Exist!" });
                } else {
                    const photo = files.image[0];
                    let oldPath = photo.filepath;
                    let originalFileName = photo.originalFilename.replace(" ", "_");
    
                    // Correct path to frontend's public directory
                    let newPath = path.join(__dirname, '../../frontend/public/images/uploaded/institute', originalFileName);
    
                    let photoData = fs.readFileSync(oldPath);
                    fs.writeFileSync(newPath, photoData);
    
                    var salt = bcrypt.genSaltSync(10);
                    var hashPassword = bcrypt.hashSync(fields.password[0], salt);
    
                    const newInstitute = new Institute({
                        institute_name: fields.institute_name[0],
                        email: fields.email[0],
                        owner_name: fields.owner_name[0],
                        password: hashPassword,
                        institute_image: originalFileName
                    });
    
                    newInstitute.save().then(savedData => {
                        console.log("Data saved", savedData);
                        res.status(200).json({ success: true, data: savedData, message: "Institute is Registered Successfully." });
                    }).catch(e => {
                        console.log("ERROR in Register", e);
                        res.status(500).json({ success: false, message: "Failed Registration." });
                    });
                }
            });
        });
    },
    
    loginInstitute: async (req, res) => {
        Institute.find({ email: req.body.email }).then(resp => {
            if (resp.length > 0) {
                const isAuth = bcrypt.compareSync(req.body.password, resp[0].password);
                if (isAuth) {   
                    const token = jwt.sign(
                        {
                            id: resp[0]._id,
                            instituteId:resp[0]._id,
                            institute_name: resp[0].institute_name,
                            owner_name:resp[0].owner_name,
                            image_url: resp[0].institute_image,
                            role:'INSTITUTE'
                        }, jwtSecret );

                   res.header("Authorization", token);
                   res.status(200).json({ success: true, message: "Success Login", 
                    user: {
                         id: resp[0]._id, 
                         owner_name:resp[0].owner_name, 
                         institute_name: resp[0].institute_name,
                          image_url: resp[0].institute_image, 
                          role: "INSTITUTE" } })
                }else {
                    res.status(401).json({ success: false, message: "Password doesn't match." })
                }

            } else {
                res.status(401).json({ success: false, message: "Email not registerd." })
            }
        })
    },
    getInstituteOwnData: async(req, res)=>{
        const id = req.user.id;
        Institute.findById(id).then(resp=>{
            if(resp){
                res.status(200).json({success:true, data:resp})
            }else {
                res.status(500).json({ success: false, message: "Institute data not Available" })
            }
        }).catch(e=>{
            console.log("Error in getInstituteWithId", e)
            res.status(500).json({ success: false, message: "Error in getting  Institute Data" })
        })
    },

    updateInstituteWithId: async (req, res) => {
        const form = new formidable.IncomingForm({
            multiples: false,
            uploadDir: path.join(__dirname, '../../frontend/public/images/uploaded/institute'),
            keepExtensions: true
        });
    
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({ message: "Error parsing the form data." });
            }
            try {
                const id = req.user.id;
                const institute = await Institute.findById(id);
    
                if (!institute) {
                    return res.status(404).json({ message: "Institute not found." });
                }
    
                // Update text fields
                Object.keys(fields).forEach((field) => {
                    institute[field] = fields[field][0];
                });
    
                // Handle image file if provided
                if (files.image) {
                    const oldImagePath = path.join(__dirname, '../../frontend/public/images/uploaded/institute', institute.institute_image);
    
                    if (institute.institute_image && fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
    
                    const originalFileName = path.basename(files.image[0].originalFilename.replace(" ", "_"));
                    const newPath = path.join(__dirname, '../../frontend/public/images/uploaded/institute', originalFileName);
    
                    const photoData = fs.readFileSync(files.image[0].filepath);
                    fs.writeFileSync(newPath, photoData);
    
                    institute.institute_image = originalFileName;
                }
    
                await institute.save();
                res.status(200).json({ message: "Institute updated successfully", data: institute });
            } catch (e) {
                console.log(e);
                res.status(500).json({ message: "Error updating institute details." });
            }
        });
    },
    
    signOut:async(req, res)=>{
       

        try {
            res.header("Authorization",  "");
            // "Authorization"
            res.status(200).json({success:true, messsage:"Institute Signed Out  Successfully."})
        } catch (error) {
            console.log("Error in Sign out", error);
            res.status(500).json({success:false, message:"Server Error in Signing Out. Try later"})
        }
    },
    isInstituteLoggedIn: async(req,  res)=>{
        try {
            let token = req.header("Authorization");
            if(token){
                var decoded = jwt.verify(token, jwtSecret);
                console.log(decoded)
                if(decoded){
                    res.status(200).json({success:true,  data:decoded, message:"Institute is a logged in One"})
                }else{
                    res.status(401).json({success:false, message:"You are not Authorized."})
                }
            }else{
                res.status(401).json({success:false, message:"You are not Authorized."})
            }
        } catch (error) {
            console.log("Error in isInstituteLoggedIn", error);
            res.status(500).json({success:false, message:"Server Error in Institute Logged in check. Try later"})
        }
    }
}