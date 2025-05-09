/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { classSchema } from "../../../yupSchema/classSchema";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Class() {
  const [studentClass, setStudentClass] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const resetMessage = () => setMessage("");

  const fetchStudentClass = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        console.log("Fetching class data...", resp);
        setStudentClass(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching class data", e);
      });
  };

  useEffect(() => {
    fetchStudentClass();
  }, [message]);

  const handleEdit = (id) => {
    setEdit(true);
    axios
      .get(`${baseUrl}/class/fetch-single/${id}`)
      .then((resp) => {
        const data = resp.data.data;
        formik.setFieldValue("class_num", data.class_num);
        formik.setFieldValue("class_text", data.class_text);
        setEditId(data._id);
      })
      .catch((e) => {
        console.log("Error fetching class for edit", e);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/class/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response?.data?.message || "Delete failed");
          setType("error");
        });
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      class_num: "",
      class_text: "",
    },
    validationSchema: classSchema,
    onSubmit: (values) => {
      if (isEdit) {
        axios
          .put(`${baseUrl}/class/update/${editId}`, values)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Update failed");
            setType("error");
          });
      } else {
        axios
          .post(`${baseUrl}/class/create`, values)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            formik.resetForm();
          })
          .catch((e) => {
            setMessage(e.response?.data?.message || "Create failed");
            setType("error");
          });
      }
    },
  });

  return (
    <>
      {message && (
        <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
      )}
      <Box sx={{ padding: "40px 10px 20px 10px" }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography className="text-beautify2 hero-text" variant="h3">
            Hall allocation to classes
          </Typography>
        </Box>

        <Box sx={{ padding: "40px" }}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "800", textAlign: "center" }}
            >
              {isEdit ? "Edit Class" : "Add New Class"}
            </Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Class Text - format: Grade, Subject name, Teacher"
                name="class_text"
                value={formik.values.class_text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.class_text && formik.errors.class_text && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {formik.errors.class_text}
                </p>
              )}

              <TextField
                fullWidth
                sx={{ marginTop: "10px" }}
                label="Hall Number"
                name="class_num"
                value={formik.values.class_num}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.class_num && formik.errors.class_num && (
                <p style={{ color: "red", textTransform: "capitalize" }}>
                  {formik.errors.class_num}
                </p>
              )}

              <Box sx={{ marginTop: "10px" }}>
                <Button type="submit" variant="contained" sx={{ marginRight: "10px" }}>
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
          {studentClass.map((value) => (
            <Paper key={value._id} sx={{ p: 2, m: 2, display: "inline-block" }}>
              <Box>
                <Typography variant="h5">
                  Class: {value.class_text} [{value.class_num}]
                </Typography>
              </Box>
              <Box sx={{ width: "80%", margin: "auto" }}>
                <IconButton aria-label="edit" onClick={() => handleEdit(value._id)}>
                  <EditIcon data-testid="EditIcon" />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => handleDelete(value._id)}>
                  <DeleteIcon data-testid="DeleteIcon" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}
