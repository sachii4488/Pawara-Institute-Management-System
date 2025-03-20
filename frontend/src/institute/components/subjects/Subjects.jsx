/*import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { subjectSchema } from "../../../yupSchema/subjectSchema";

export default function Subject() {
  const [studentSubject, setStudentSubject] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // New state for teacher dropdown
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState("");

  // MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");
  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    subject_name: "",
    subject_codename: ""
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: subjectSchema,
    onSubmit: (values) => {
      // Include the teacher field in the payload
      const payload = { ...values, teacher };
      if (isEdit) {
        console.log("edit id", editId);
        axios
          .patch(`${baseUrl}/subject/update/${editId}`, payload)
          .then((resp) => {
            console.log("Edit submit", resp);
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.log("Error, edit casting submit", e);
          });
      } else {
        axios
          .post(`${baseUrl}/subject/create`, payload)
          .then((resp) => {
            console.log("Response after submitting admin casting", resp);
            setMessage(resp.data.message);
            setType("success");
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.log("Error, response admin casting calls", e);
          });
        Formik.resetForm();
      }
    }
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/subject/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
          console.log("Error, deleting", e);
        });
    }
  };

  const handleEdit = (id) => {
    console.log("Handle Edit is called", id);
    setEdit(true);
    axios
      .get(`${baseUrl}/subject/fetch-single/${id}`)
      .then((resp) => {
        // Expecting data in resp.data.data
        const data = resp.data.data;
        Formik.setFieldValue("subject_name", data.subject_name);
        Formik.setFieldValue("subject_codename", data.subject_codename);
        setTeacher(data.teacher); // Set teacher from fetched subject data
        setEditId(data._id);
      })
      .catch((e) => {
        console.log("Error in fetching edit data.", e);
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
    setTeacher("");
  };

  // Fetch teacher list
  useEffect(() => {
    axios
      .get(`${baseUrl}/teacher/fetch-with-query`, { params: {} })
      .then((resp) => {
        setTeachers(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching teachers", e);
      });
  }, []);

  const fetchstudentssubject = () => {
    axios
      .get(`${baseUrl}/subject/fetch-all`)
      .then((resp) => {
        console.log("Fetching data in Casting Calls admin.", resp);
        setStudentSubject(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching casting calls admin data", e);
      });
  };

  const fetchStudentSubject = () => {
    // Additional fetch if needed
  };

  useEffect(() => {
    fetchstudentssubject();
    fetchStudentSubject();
  }, [message]);

  return (
    <>
      {message && (
        <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
      )}
      <Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          component={"div"}
        >
          <Typography className="hero-text" variant="h3">
            Classes with Subjects
          </Typography>
        </Box>

        <Box component={"div"} sx={{}}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            {isEdit ? (
              <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
                Edit subject
              </Typography>
            ) : (
              <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
                Add New subject
              </Typography>
            )}{" "}
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={Formik.handleSubmit}
            >
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Subject Text"
                variant="outlined"
                name="subject_name"
                value={Formik.values.subject_name}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.subject_name && Formik.errors.subject_name && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.subject_name}
                </p>
              )}

              // Teacher Dropdown 
              <FormControl fullWidth margin="normal">
                <InputLabel>Teacher</InputLabel>
                <Select
                  label="Teacher"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  required
                >
                  {teachers.map((t) => (
                    <MenuItem key={t._id} value={t._id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

             
              {Formik.touched.subject_codename && Formik.errors.subject_codename && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.subject_codename}
                </p>
              )}

              <Box sx={{ marginTop: "10px" }} component={"div"}>
                <Button type="submit" sx={{ marginRight: "10px" }} variant="contained">
                  Submit
                </Button>
                {isEdit && (
                  <Button sx={{ marginRight: "10px" }} variant="outlined" onClick={cancelEdit}>
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell component="th" scope="row">
                    subject Name
                  </TableCell>
                  <TableCell align="right">Teacher</TableCell>
                  <TableCell align="right">Details</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentSubject.map((value, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {value.subject_name}
                    </TableCell>
                    <TableCell align="right">{value.subject_codename}</TableCell>
                    <TableCell align="right">{"Details"}</TableCell>
                    <TableCell align="right">
                      <Box
                        component={"div"}
                        sx={{ bottom: 0, display: "flex", justifyContent: "end" }}
                      >
                        <Button
                          variant="contained"
                          sx={{ background: "red", color: "#fff" }}
                          onClick={() => {
                            handleDelete(value._id);
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            background: "gold",
                            color: "#222222",
                            marginLeft: "10px"
                          }}
                          onClick={() => {
                            handleEdit(value._id);
                          }}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}*/
/*import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { subjectSchema } from "../../../yupSchema/subjectSchema";

export default function Subject() {
  const [studentSubject, setStudentSubject] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Teacher dropdown
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState("");

  // NEW: Grade dropdown
  const [grade, setGrade] = useState("");
  // Example list of grades. Alternatively, fetch from your backend if needed.
  const gradeOptions = ["Grade 1 to 5","Grade 06", "Grade 07", "Grade 08", "Grade 09", "Grade 10", "Grade 11"];

  // NEW: Class Fee
  const [classFee, setClassFee] = useState("");

  // Messages
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");
  const resetMessage = () => {
    setMessage("");
  };

  // Formik initial values (existing subject fields)
  const initialValues = {
    subject_name: "",
    subject_codename: "" ,
    grade:"",
   classFee:"",
   teacher:""
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: subjectSchema,
    onSubmit: (values) => {
      // Combine all fields into one payload
      const payload = {
        ...values,
        teacher,
        grade,
        classFee
      };

      if (isEdit) {
        // Update
        axios
          .patch(`${baseUrl}/subject/update/${editId}`, payload)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Error updating subject");
            setType("error");
            console.log("Error updating subject", e);
          });
      } else {
        // Create
        axios
          .post(`${baseUrl}/subject/create`, payload)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            Formik.resetForm();
            // Reset local states for new subject
            setTeacher("");
            setGrade("");
            setClassFee("");
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Error creating subject");
            setType("error");
            console.log("Error creating subject", e);
          });
      }
    }
  });

  // Handle Delete
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/subject/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response?.data?.message || "Error deleting subject");
          setType("error");
          console.log("Error deleting subject", e);
        });
    }
  };

  // Handle Edit
  const handleEdit = (id) => {
    setEdit(true);
    axios
      .get(`${baseUrl}/subject/fetch-single/${id}`)
      .then((resp) => {
        const data = resp.data.data;
        // Populate fields
        Formik.setFieldValue("subject_name", data.subject_name || "");
        Formik.setFieldValue("subject_codename", data.subject_codename || "");
        setTeacher(data.teacher || "");
        setGrade(data.grade || "");
        setClassFee(data.classFee || "");
        setEditId(data._id);
      })
      .catch((e) => {
        console.log("Error fetching subject for edit:", e);
      });
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
    setTeacher("");
    setGrade("");
    setClassFee("");
  };

  // Fetch teacher list on mount
  useEffect(() => {
    axios
      .get(`${baseUrl}/teacher/fetch-with-query`, { params: {} })
      .then((resp) => {
        setTeachers(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching teachers", e);
      });
  }, []);

  // Fetch all subjects
  const fetchstudentssubject = () => {
    axios
      .get(`${baseUrl}/subject/fetch-all`)
      .then((resp) => {
        setStudentSubject(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching subject list", e);
      });
  };

  const fetchStudentSubject = () => {
    // Additional fetch if needed
  };

  // Refresh the table whenever message changes (successful create/edit/delete)
  useEffect(() => {
    fetchstudentssubject();
    fetchStudentSubject();
  }, [message]);

  return (
    <>
      {message && (
        <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
      )}
      <Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          component={"div"}
        >
          <Typography className="hero-text" variant="h3">
            Classes with Subjects
          </Typography>
        </Box>

        <Box component={"div"} sx={{}}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            {isEdit ? (
              <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
                Edit subject
              </Typography>
            ) : (
              <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
                Add New subject
              </Typography>
            )}
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={Formik.handleSubmit}
            >
              // Subject Name 
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Subject Name"
                variant="outlined"
                name="subject_name"
                value={Formik.values.subject_name}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.subject_name && Formik.errors.subject_name && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.subject_name}
                </p>
              )}

              // Grade Dropdown 
              <FormControl fullWidth sx={{ marginTop: "10px" }}>
                <InputLabel>Grade</InputLabel>
                <Select
                  label="Grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                >
                  {gradeOptions.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              // Teacher Dropdown 
              <FormControl fullWidth margin="normal">
                       <InputLabel>Teacher</InputLabel>
                       <Select
                         label="Teacher"
                         value={teacher}
                         onChange={(e) => setTeacher(e.target.value)}
                         required
                       >
                         {teachers.map((t) => (
                           <MenuItem key={t._id} value={t._id}>
                             {t.name}
                           </MenuItem>
                         ))}
                       </Select>
                     </FormControl>

              // Class Fee 
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Class Fee"
                variant="outlined"
                type="number"
                name="classFee"
                value={classFee}
                onChange={(e) => setClassFee(e.target.value)}
              />

              {/* subject_codename field if you still need it */
              {/*
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Subject Codename"
                variant="outlined"
                name="subject_codename"
                value={Formik.values.subject_codename}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.touched.subject_codename && Formik.errors.subject_codename && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {Formik.errors.subject_codename}
                </p>
              )}
              */}

             /* <Box sx={{ marginTop: "10px" }} component={"div"}>
                <Button type="submit" sx={{ marginRight: "10px" }} variant="contained">
                  Submit
                </Button>
                {isEdit && (
                  <Button
                    sx={{ marginRight: "10px" }}
                    variant="outlined"
                    onClick={cancelEdit}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Grade</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Class Fees</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentSubject.map((value, i) => (
                  <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{value.grade || "-"}</TableCell>
                    <TableCell>{value.subject_name}</TableCell>
                    <TableCell>
                     
                       {value.teacher?.name || "-"}
                    </TableCell>
                    <TableCell>{value.classFee || "-"}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                          variant="contained"
                          sx={{ background: "red", color: "#fff" }}
                          onClick={() => handleDelete(value._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ background: "gold", color: "#222222", marginLeft: "10px" }}
                          onClick={() => handleEdit(value._id)}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
*/
/*import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { subjectSchema } from "../../../yupSchema/subjectSchema";

export default function Subject() {
  const [studentSubject, setStudentSubject] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Teacher dropdown
  const [teachers, setTeachers] = useState([]);
  
  // Grade dropdown options
  const gradeOptions = ["Grade 1 to 5","Grade 06", "Grade 07", "Grade 08", "Grade 09", "Grade 10", "Grade 11"];
  
  // For messages
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");
  const resetMessage = () => {
    setMessage("");
  };

  // Use Formik for all fields
  const formik = useFormik({
    initialValues: {
      subject_name: "",
    //  subject_codename: "",
      teacher: "",
      grade: "",
      classFee: ""
    },
    validationSchema: subjectSchema,
    onSubmit: (values) => {
      console.log("data submitted with:",values)
      if (isEdit) {
        axios
          .patch(`${baseUrl}/subject/update/${editId}`, values)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Error updating subject");
            setType("error");
            console.log("Error updating subject", e);
          });
      } else {
        axios
          .post(`${baseUrl}/subject/create`, values)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            formik.resetForm();
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Error creating subject");
            setType("error");
            console.log("Error creating subject", e);
          });
      }
    }
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/subject/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response?.data?.message || "Error deleting subject");
          setType("error");
          console.log("Error deleting subject", e);
        });
    }
  };

  const handleEdit = (id) => {
    setEdit(true);
    axios
      .get(`${baseUrl}/subject/fetch-single/${id}`)
      .then((resp) => {
        const data = resp.data.data;
        formik.setValues({
          subject_name: data.subject_name || "",
         // subject_codename: data.subject_codename || "",
          teacher: data.teacher || "",
          grade: data.grade || "",
          classFee: data.classFee || ""
        });
        setEditId(data._id);
      })
      .catch((e) => {
        console.log("Error fetching subject for edit:", e);
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    formik.resetForm();
  };

  // Fetch teacher list on mount
  useEffect(() => {
    axios
      .get(`${baseUrl}/teacher/fetch-with-query`, { params: {} })
      .then((resp) => {
        setTeachers(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching teachers", e);
      });
  }, []);

  // Fetch all subjects
  const fetchstudentssubject = () => {
    axios
      .get(`${baseUrl}/subject/fetch-all`)
      .then((resp) => {
        setStudentSubject(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching subject list", e);
      });
  };

  const fetchStudentSubject = () => {
    // Additional fetch if needed
  };

  useEffect(() => {
    fetchstudentssubject();
    fetchStudentSubject();
  }, [message]);

  return (
    <>
      {message && (
        <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
      )}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} component="div">
          <Typography className="hero-text" variant="h3">
            Classes with Subjects
          </Typography>
        </Box>

        <Box component="div" sx={{}}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            {isEdit ? (
              <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
                Edit subject
              </Typography>
            ) : (
              <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
                Add New subject
              </Typography>
            )}
           
            <Box sx={{ marginTop: "10px" }}>
              //Manually trigger submission 
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Subject Name"
                variant="outlined"
                name="subject_name"
                value={formik.values.subject_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.subject_name && formik.errors.subject_name && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {formik.errors.subject_name}
                </p>
              )}

            // Grade Dropdown 
              <FormControl fullWidth sx={{ marginTop: "10px" }}>
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  label="Grade"
                  value={formik.values.grade}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                >
                  {gradeOptions.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              // Teacher Dropdown 
              <FormControl fullWidth sx={{ marginTop: "10px" }}>
                <InputLabel>Teacher</InputLabel>
                <Select
                  name="teacher"
                  label="Teacher"
                  value={formik.values.teacher}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                >
                  {teachers.map((t) => (
                    <MenuItem key={t._id} value={t._id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              // Class Fee 
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Class Fee"
                variant="outlined"
                type="number"
                name="classFee"
                value={formik.values.classFee}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <Box sx={{ marginTop: "10px" }}>
                <Button
                  onClick={formik.handleSubmit}
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  type="button"
                >
                  Submit
                </Button>
                {isEdit && (
                  <Button variant="outlined" onClick={cancelEdit}>
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Subject Table">
              <TableHead>
                <TableRow>
                  <TableCell>Grade</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Class Fees</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentSubject.map((value, i) => (
                  <TableRow key={i}>
                    <TableCell>{value.grade || "-"}</TableCell>
                    <TableCell>{value.subject_name}</TableCell>
                    <TableCell>{value.teacher ? value.teacher.name : "-"}</TableCell>
                    <TableCell>{value.classFee || "-"}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                          variant="contained"
                          sx={{ background: "red", color: "#fff" }}
                          onClick={() => handleDelete(value._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ background: "gold", color: "#222", marginLeft: "10px" }}
                          onClick={() => handleEdit(value._id)}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
*/
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { subjectSchema } from "../../../yupSchema/subjectSchema";

export default function Subject() {
  const [studentSubject, setStudentSubject] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Teacher dropdown
  const [teachers, setTeachers] = useState([]);
  
  // Grade dropdown options
  const gradeOptions = ["Grade 1 to 5", "Grade 06", "Grade 07", "Grade 08", "Grade 09", "Grade 10", "Grade 11"];
  
  // For messages
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");
  const resetMessage = () => {
    setMessage("");
  };

  // Use Formik for all fields
  const formik = useFormik({
    initialValues: {
      subject_name: "",
      subject_codename: "",
      teacher: "",
      grade: "",
      classFee: ""
    },
    validationSchema: subjectSchema,
    onSubmit: (values) => {
      if (isEdit) {
        axios
          .patch(`${baseUrl}/subject/update/${editId}`, values)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Error updating subject");
            setType("error");
            console.log("Error updating subject", e);
          });
      } else {
        axios
          .post(`${baseUrl}/subject/create`, values)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            formik.resetForm();
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Error creating subject");
            setType("error");
            console.log("Error creating subject", e);
          });
      }
    }
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/subject/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response?.data?.message || "Error deleting subject");
          setType("error");
          console.log("Error deleting subject", e);
        });
    }
  };

  const handleEdit = (id) => {
    setEdit(true);
    axios
      .get(`${baseUrl}/subject/fetch-single/${id}`)
      .then((resp) => {
        const data = resp.data.data;
        formik.setValues({
          subject_name: data.subject_name || "",
          subject_codename: data.subject_codename || "",
          teacher: data.teacher || "",
          grade: data.grade || "",
          classFee: data.classFee || ""
        });
        setEditId(data._id);
      })
      .catch((e) => {
        console.log("Error fetching subject for edit:", e);
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    formik.resetForm();
  };

  // Fetch teacher list on mount
  useEffect(() => {
    axios
      .get(`${baseUrl}/teacher/fetch-with-query`, { params: {} })
      .then((resp) => {
        setTeachers(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching teachers", e);
      });
  }, []);

  // Fetch all subjects
  const fetchstudentssubject = () => {
    axios
      .get(`${baseUrl}/subject/fetch-all`)
      .then((resp) => {
        setStudentSubject(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching subject list", e);
      });
  };

  const fetchStudentSubject = () => {
    // Additional fetch if needed
  };

  useEffect(() => {
    fetchstudentssubject();
    fetchStudentSubject();
  }, [message]);

  return (
    <>
      {message && (
        <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
      )}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} component="div">
          <Typography className="hero-text" variant="h3">
            Classes with Subjects
          </Typography>
        </Box>

        <Box component="div" sx={{}}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            {isEdit ? (
              <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
                Edit subject
              </Typography>
            ) : (
              <Typography variant="h4" sx={{ fontWeight: "800", textAlign: "center" }}>
                Add New subject
              </Typography>
            )}
            {/* Use a regular Box (no form element) to avoid nesting issues */}
            <Box sx={{ marginTop: "10px" }}>
              {/* Subject Name */}
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Subject Name"
                variant="outlined"
                name="subject_name"
                value={formik.values.subject_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.subject_name && formik.errors.subject_name && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {formik.errors.subject_name}
                </p>
              )}

              {/* Grade Dropdown */}
              <FormControl fullWidth sx={{ marginTop: "10px" }}>
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  label="Grade"
                  value={formik.values.grade}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                >
                  {gradeOptions.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Teacher Dropdown */}
              <FormControl fullWidth sx={{ marginTop: "10px" }}>
                <InputLabel>Teacher</InputLabel>
                <Select
                  name="teacher"
                  label="Teacher"
                  value={formik.values.teacher}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                >
                  {teachers.map((t) => (
                    <MenuItem key={t._id} value={t._id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Class Fee */}
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Class Fee"
                variant="outlined"
                type="number"
                name="classFee"
                value={formik.values.classFee}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <Box sx={{ marginTop: "10px" }}>
                <Button
                  onClick={formik.handleSubmit}
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  type="button"
                >
                  Submit
                </Button>
                {isEdit && (
                  <Button variant="outlined" onClick={cancelEdit}>
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Subject Table">
              <TableHead>
                <TableRow>
                  <TableCell>Grade</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Class Fees</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentSubject.map((value, i) => (
                  <TableRow key={i}>
                    <TableCell>{value.grade || "-"}</TableCell>
                    <TableCell>{value.subject_name}</TableCell>
                    <TableCell>{value.teacher ? value.teacher.name : "-"}</TableCell>
                    <TableCell>{value.classFee || "-"}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button
                          variant="contained"
                          sx={{ background: "red", color: "#fff" }}
                          onClick={() => handleDelete(value._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ background: "gold", color: "#222", marginLeft: "10px" }}
                          onClick={() => handleEdit(value._id)}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
