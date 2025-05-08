import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  TextField,
  Typography,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { Link } from "react-router-dom";

export default function Attendance() {
  const [studentClass, setStudentClass] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const resetMessage = () => setMessage("");
 console.log("chamara");
  // Fetch all classes
  const fetchStudentClass = () => {
    axios
      .get(`${baseUrl}/class/fetch-all`)
      .then((resp) => {
        setStudentClass(resp.data.data);
        console.log(resp.data.data)
      })
      .catch((e) => {
        console.log("Error fetching classes", e);
      });
  };

  // Fetch students by class ID
  const fetchStudentsByClass = (classId) => {

    console.log(classId);
    axios
      .get(`${baseUrl}/student/get-student-by-classid/${classId}`)
      .then((resp) => {
        const studentData = resp.data.data || [];
        setStudents(studentData);
        setFilteredStudents(studentData);
      })
      .catch((e) => {
        console.log("Error fetching students", e);
      });
  };

  // Handle class selection
  const handleClass = (e) => {
    const selectedId = e.target.value;
    setSelectedClassId(selectedId);
    setSearchTerm("");
    console.log(selectedId);

    if (selectedId) {
      fetchStudentsByClass(selectedId);
    } else {
      setStudents([]);
      setFilteredStudents([]);
    }
  };

  // Handle search by student name
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (!searchValue) {
      setFilteredStudents(students); // Reset if search cleared
      return;
    }

    const filtered = students.filter((student) =>
      student.name?.toLowerCase().includes(searchValue)
    );
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    fetchStudentClass();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudentsByClass(selectedClassId);
    } else {
      setStudents([]);
      setFilteredStudents([]);
    }
  }, [selectedClassId]);
  

  return (
    <>
      {message && (
        <CustomizedSnackbars reset={resetMessage} type={type} message={message} />
      )}

      <Box sx={{ background: "rgb(2, 12, 20)", padding: "40px 10px 20px 10px" }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography className="text-beautify hero-text" sx={{ color: "#fff", fontSize: "2rem" }}>
            Attendance
          </Typography>
        </Box>

        <Box
          sx={{
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            marginBottom: "20px",
            background: "#fff",
            borderRadius: 1,
          }}
        >
          <FormControl sx={{ minWidth: "200px", width: "100%", maxWidth: "400px" }}>
            <InputLabel id="class-select-label">Classes</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClassId}
              label="Class"
              onChange={handleClass}
            >
              <MenuItem value="">Select Class</MenuItem>
              {studentClass.map((value, i) => (
                <MenuItem key={i} value={value._id}>
                  {value.class_text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            id="search"
            label="Search Name .."
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: "100%", maxWidth: "400px" }}
          />
        </Box>

        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="student table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Class</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                  <TableCell align="right">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, i) => (
                  <TableRow key={i}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell align="right">
                      {Array.isArray(student.student_classes)
                        ? student.student_classes.join(", ")
                        : student.student_classes || "N/A"}
                    </TableCell>
                    <TableCell align="right">0.00%</TableCell>
                    <TableCell align="right">
                      <Link to={`/institute/attendance-student/${student._id}`}>
                        Details
                      </Link>
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
