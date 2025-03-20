/*import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { studentSchema } from "../../../yupSchema/studentSchema";
import StudentCardAdmin from "../../utility components/student card/StudentCard";

export default function Students() {
  const [studentClass, setStudentClass] = useState([]);
  const [students, setStudents] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Independent state for image preview

  // Handle image file selection
  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const [params, setParams] = useState({});
  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_classes: e.target.value || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/student/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
        });
    }
  };

  const handleEdit = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/student/fetch-single/${id}`);
      // The actual data is in resp.data.data
      const student = resp.data.data;

      console.log("Fetched Data:", student);
      console.log("student_classes:", student.student_classes);

      // Convert class text to their corresponding _id
      const classIds = Array.isArray(student.student_classes)
        ? student.student_classes.map((clsText) => {
            // Find the matching class object in studentClass array
            const foundClass = studentClass.find(
              (sc) => sc.class_text === clsText
            );
            return foundClass ? foundClass._id : "";
          })
        : [];

      // If your backend returns a plain password field (e.g., 'plain_password'),
      // use it here. Otherwise, you'll only get a hashed password.
      Formik.setValues({
      // institute: student.institute,
        email: student.email,
        name: student.name,
        student_classes: classIds,
        age: student.age,
        gender: student.gender,
        guardian: student.guardian,
        guardian_phone: student.guardian_phone,
        student_image: student.student_image,
        // Use 'student.plain_password' if your API returns it in plain text
        password: student.password
      })

      // Show the existing image preview
      if (student.student_image) {
        setFile(null);
        // Assuming your backend serves images at baseUrl/uploads/filename
        setImageUrl(`${baseUrl}/uploads/${student.student_image}`);
      }

      setEditId(id);
      setEdit(true);
    } catch (err) {
      console.error("Error fetching student data", err);
    }
  };

  
  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
  };

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const resetMessage = () => setMessage("");

  const initialValues = {
    institute: "",
    email: "",
    name: "",
    student_classes: [],
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    student_image: "",
    password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: studentSchema,
    onSubmit: (values) => {
      if (isEdit) {
        const fd = new FormData();
        Object.keys(values).forEach((key) => fd.append(key, values[key]));
        if (file) {
          fd.append("image", file, file.name);
        }

        axios
          .patch(`${baseUrl}/student/update/${editId}`, fd)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            handleClearFile();
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
          });
      } else {
        if (file) {
          const fd = new FormData();
          fd.append("image", file, file.name);
          Object.keys(values).forEach((key) => fd.append(key, values[key]));

          axios
            .post(`${baseUrl}/student/register`, fd)
            .then((resp) => {
              setMessage(resp.data.message);
              setType("success");
              Formik.resetForm();
              handleClearFile();
            })
            .catch((e) => {
              setMessage(e.response.data.message);
              setType("error");
            });
        } else {
          setMessage("Please provide an image.");
          setType("error");
        }
      }
    },
  });

  const fetchStudentClass = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        setStudentClass(resp.data.data);
      })
      .catch(() => console.log("Error in fetching student Class"));
  };

  const fetchStudents = () => {
    axios
      .get(`${baseUrl}/student/fetch-with-query`, { params })
      .then((resp) => {
        setStudents(resp.data.data);
      })
      .catch(() =>
        console.log(
          "Error in fetching Student with query",
          error.message,
          error.stack
        )
      );
  };

  useEffect(() => {
    fetchStudents();
    fetchStudentClass();
  }, [message, params]);

  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  };



  return (
    <>
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}
      <Box sx={{ padding: "40px 10px 20px 10px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }} component="div">
          <Typography variant="h2">Students </Typography>
        </Box>

        <Box sx={{ padding: "40px" }}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "800", textAlign: "center" }}
            >
              {isEdit ? "Edit Student" : "Add New Student"}
            </Typography>

            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={Formik.handleSubmit}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ marginRight: "50px" }} variant="h4">
                  Student Pic
                </Typography>
                <TextField
                  sx={{ marginTop: "10px" }}
                  id="filled-basic"
                  variant="outlined"
                  name="file"
                  type="file"
                  onChange={addImage}
                  inputRef={fileInputRef}
                />

                {imageUrl && (
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      height="240px"
                    />
                  </Box>
                )}
              </Box>
              
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="email "
                variant="outlined"
                name="email"
                value={Formik.values.email}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.email && Formik.errors.email && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.email}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="name "
                variant="outlined"
                name="name"
                value={Formik.values.name}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.name && Formik.errors.name && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.name}
                </p>
              )}
              <FormControl fullWidth sx={{ marginTop: "10px" }}>
  <InputLabel id="class-select-label">Classes</InputLabel>
  <Select
    labelId="class-select-label"
    id="class-select"
    multiple
    name="student_classes"
    // 1) Directly store _id in Formik
    value={Formik.values.student_classes}
    onChange={(e) => {
      Formik.setFieldValue("student_classes", e.target.value);
    }}
    onBlur={Formik.handleBlur}
    // 2) Display class_text using renderValue
    renderValue={(selectedIds) =>
      studentClass
        .filter((cls) => selectedIds.includes(cls._id))
        .map((cls) => cls.class_text)
        .join(", ")
    }
  >
    {studentClass.map((cls) => (
      <MenuItem key={cls._id} value={cls._id}>
        {cls.class_text}
      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {Formik.touched.student_classes &&
                Formik.errors.student_classes && (
                  <p style={{ color: "red" ,textTransform: "capitalize"}}>
                    {Formik.errors.student_classes}
                  </p>
                )}

              
              <br />
              <FormControl sx={{ minWidth: "220px", marginTop: "10px" }}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Gender"
                  name="gender"
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  value={Formik.values.gender ||""}
                >
                  <MenuItem value={""}>Select Gender</MenuItem>
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
              {Formik.touched.gender && Formik.errors.gender && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.gender}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="Age "
                variant="outlined"
                name="age"
                value={Formik.values.age}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.age && Formik.errors.age && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.age}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="Guardian "
                variant="outlined"
                name="guardian"
                value={Formik.values.guardian}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.guardian && Formik.errors.guardian && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.guardian}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="Guardian Phone "
                variant="outlined"
                name="guardian_phone"
                value={Formik.values.guardian_phone}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.guardian_phone &&
                Formik.errors.guardian_phone && (
                  <p style={{ color: "red", textTransform: "capitalize" }}>
                    {Formik.errors.guardian_phone}
                  </p>
                )}

              {!isEdit && (
                <>
                  <TextField
                    fullWidth
                    sx={{ marginTop: "10px" }}
                    id="filled-basic"
                    label="Password "
                    variant="outlined"
                    name="password"
                    value={Formik.values.password}
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  />
                  {Formik.touched.password && Formik.errors.password && (
                    <p style={{ color: "red", textTransform: "capitalize" }}>
                      {Formik.errors.password}
                    </p>
                  )}
                </>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ marginTop: "10px" }}
              >
                {isEdit ? "Update Student" : "Register Student"}
              </Button>
              {isEdit && (
                <Button
                  fullWidth
                  onClick={cancelEdit}
                  variant="outlined"
                  sx={{ marginTop: "10px" }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Paper>
        </Box>


        
        <Box sx={{ padding: "40px", display: "flex", flexWrap: "wrap" }}>
          {students.length > 0 &&
            students.map((value, i) => (
              <StudentCardAdmin
                key={i}
                student={value}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))}
        </Box>
      </Box>
    </>
  );
}*/

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { studentSchema } from "../../../yupSchema/studentSchema";
import StudentCard from "../../utility components/student card/StudentCard";


export default function Students() {
  const [studentClass, setStudentClass] = useState([]);
  const [students, setStudents] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Handle image file selection and preview
  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const [params, setParams] = useState({});
  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_classes: e.target.value || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/student/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
        });
    }
  };

  // Edit student record and populate form fields
  const handleEdit = async (id) => {
    try {
      const resp = await axios.get(`${baseUrl}/student/fetch-single/${id}`);
      const student = resp.data.data;
      console.log("Fetched Data:", student);
      console.log("student_classes:", student.student_classes);

      // Convert class text to corresponding _id using your studentClass list
      const classIds = Array.isArray(student.student_classes)
        ? student.student_classes.map((clsText) => {
            const foundClass = studentClass.find(
              (sc) => sc.class_text === clsText
            );
            return foundClass ? foundClass._id : "";
          })
        : [];

      Formik.setValues({
        email: student.email,
        name: student.name,
        student_classes: classIds,
        age: student.age,
        gender: student.gender,
        guardian: student.guardian,
        guardian_phone: student.guardian_phone,
        student_image: student.student_image,
        password: student.password,
      });

      if (student.student_image) {
        setFile(null);
        setImageUrl(`${baseUrl}/uploads/${student.student_image}`);
      }

      setEditId(id);
      setEdit(true);
    } catch (err) {
      console.error("Error fetching student data", err);
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
  };

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const resetMessage = () => setMessage("");

  const initialValues = {
    institute: "",
    email: "",
    name: "",
    student_classes: [],
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    student_image: "",
    password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: studentSchema,
    onSubmit: (values) => {
      if (isEdit) {
        const fd = new FormData();
        Object.keys(values).forEach((key) => fd.append(key, values[key]));
        if (file) {
          fd.append("image", file, file.name);
        }

        axios
          .patch(`${baseUrl}/student/update/${editId}`, fd)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            handleClearFile();
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
          });
      } else {
        if (file) {
          const fd = new FormData();
          fd.append("image", file, file.name);
          Object.keys(values).forEach((key) => fd.append(key, values[key]));

          axios
            .post(`${baseUrl}/student/register`, fd)
            .then((resp) => {
              setMessage(resp.data.message);
              setType("success");
              Formik.resetForm();
              handleClearFile();
            })
            .catch((e) => {
              setMessage(e.response.data.message);
              setType("error");
            });
        } else {
          setMessage("Please provide an image.");
          setType("error");
        }
      }
    },
  });

  const fetchStudentClass = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        setStudentClass(resp.data.data);
      })
      .catch(() => console.log("Error in fetching student Class"));
  };

  const fetchStudents = () => {
    axios
      .get(`${baseUrl}/student/fetch-with-query`, { params })
      .then((resp) => {
        setStudents(resp.data.data);
      })
      .catch((error) =>
        console.log("Error in fetching Student with query", error.message, error.stack)
      );
  };

  useEffect(() => {
    fetchStudents();
    fetchStudentClass();
  }, [message, params]);

  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  };

  return (
    <>
      {message && (
        <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
      )}
      <Box sx={{ padding: "40px 10px 20px 10px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }} component="div">
          <Typography variant="h2">Students </Typography>
        </Box>

        <Box sx={{ padding: "40px" }}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
              {isEdit ? "Edit Student" : "Add New Student"}
            </Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={Formik.handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Typography sx={{ marginRight: "50px" }} variant="h4">
                  Student Pic
                </Typography>
                <TextField
                  sx={{ marginTop: "10px" }}
                  id="filled-basic"
                  variant="outlined"
                  name="file"
                  type="file"
                  onChange={addImage}
                  inputRef={fileInputRef}
                />

                {imageUrl && (
                  <Box sx={{ position: "relative" }}>
                    <CardMedia component="img" image={imageUrl} height="240px" />
                  </Box>
                )}
              </Box>

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="Email"
                variant="outlined"
                name="email"
                value={Formik.values.email}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.email && Formik.errors.email && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.email}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="Name"
                variant="outlined"
                name="name"
                value={Formik.values.name}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.name && Formik.errors.name && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.name}
                </p>
              )}

              <FormControl fullWidth sx={{ marginTop: "10px" }}>
                <InputLabel id="class-select-label">Classes</InputLabel>
                <Select
                  labelId="class-select-label"
                  id="class-select"
                  multiple
                  name="student_classes"
                  value={Formik.values.student_classes}
                  onChange={(e) => {
                    Formik.setFieldValue("student_classes", e.target.value);
                  }}
                  onBlur={Formik.handleBlur}
                  renderValue={(selectedIds) =>
                    studentClass
                      .filter((cls) => selectedIds.includes(cls._id))
                      .map((cls) => cls.class_text)
                      .join(", ")
                  }
                >
                  {studentClass.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.class_text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {Formik.touched.student_classes && Formik.errors.student_classes && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.student_classes}
                </p>
              )}

              <br />
              <FormControl sx={{ minWidth: "220px", marginTop: "10px" }}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Gender"
                  name="gender"
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  value={Formik.values.gender || ""}
                >
                  <MenuItem value={""}>Select Gender</MenuItem>
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
              {Formik.touched.gender && Formik.errors.gender && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.gender}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="Age"
                variant="outlined"
                name="age"
                value={Formik.values.age}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.age && Formik.errors.age && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.age}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="Guardian"
                variant="outlined"
                name="guardian"
                value={Formik.values.guardian}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.guardian && Formik.errors.guardian && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.guardian}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                id="filled-basic"
                label="Guardian Phone"
                variant="outlined"
                name="guardian_phone"
                value={Formik.values.guardian_phone}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.guardian_phone && Formik.errors.guardian_phone && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.guardian_phone}
                </p>
              )}

              {!isEdit && (
                <>
                  <TextField
                    fullWidth
                    sx={{ marginTop: "10px" }}
                    id="filled-basic"
                    label="Password"
                    variant="outlined"
                    name="password"
                    value={Formik.values.password}
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  />
                  {Formik.touched.password && Formik.errors.password && (
                    <p style={{ color: "red", textTransform: "capitalize" }}>
                      {Formik.errors.password}
                    </p>
                  )}
                </>
              )}

              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: "10px" }}>
                {isEdit ? "Update Student" : "Register Student"}
              </Button>
              {isEdit && (
                <Button fullWidth onClick={cancelEdit} variant="outlined" sx={{ marginTop: "10px" }}>
                  Cancel
                </Button>
              )}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ padding: "40px", display: "flex", flexWrap: "wrap" }}>
          {students.length > 0 &&
            students.map((value, i) => (
              <StudentCard
                key={i}
                student={value}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))}
        </Box>
      </Box>
    </>
  );
}
