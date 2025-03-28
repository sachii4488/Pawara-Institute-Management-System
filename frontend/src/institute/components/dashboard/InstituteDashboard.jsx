import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  CardMedia,
  IconButton,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import PreviewIcon from "@mui/icons-material/Preview";

// ChartJS setup
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { baseUrl } from "../../../environment";
import styled from "@emotion/styled";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  minWidth: "400px",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const InstituteDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [instituteDetails, setInstituteDetails] = useState(null);
  const [instituteName, setInstituteName] = useState("");
  const [schooImage, setInstituteImage] = useState("");
  const [instituteEdit, setInstituteEdit] = useState(false);
  const [preview, setPreview] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const resetMessage = () => setMessage("");

  // Dummy Data
  const dummyData = {
    totalStudents: 120,
    totalTeachers: 15,
    classes: [
      { _id: "1", class_text: "Class 1" },
      { _id: "2", class_text: "Class 2" },
      { _id: "3", class_text: "Class 3" },
      { _id: "4", class_text: "Class 4" },
    ],
    subjects: [
      { _id: "1", subject_name: "Mathematics" },
      { _id: "2", subject_name: "Science" },
      { _id: "3", subject_name: "History" },
      { _id: "4", subject_name: "Geography" },
    ],
  };

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const studentRes = await axios.get(`${baseUrl}/student/fetch-with-query`, {
        params: {},
      });
      const teacherRes = await axios.get(`${baseUrl}/teacher/fetch-with-query`, {
        params: {},
      });
      const classesRes = await axios.get(`${baseUrl}/class/fetch-all`);
      const subjectsRes = await axios.get(`${baseUrl}/subject/fetch-all`);
      const instituteData = await axios.get(`${baseUrl}/institute/fetch-single`);

      setInstituteDetails(instituteData.data.data);
      setInstituteName(instituteData.data.data.institute_name);
      setInstituteImage(instituteData.data.data.institute_image);
      setTotalStudents(studentRes.data.data.length);
      setTotalTeachers(teacherRes.data.data.length);
      setClasses(classesRes.data.data || dummyData.classes);
      setSubjects(subjectsRes.data.data || dummyData.subjects);
    } catch (error) {
      setTotalStudents(dummyData.totalStudents);
      setTotalTeachers(dummyData.totalTeachers);
      setClasses(dummyData.classes);
      setSubjects(dummyData.subjects);
    }
  };

  useEffect(() => {
    fetchData();
  }, [message]);

  // Filtered Data for Charts
  const filteredClasses = classes.filter((c) =>
    c.class_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubjects = subjects.filter((s) =>
    s.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Data for Classes and Subjects Chart
  const classesData = {
    labels: filteredClasses.map((classObj) => classObj.class_text),
    datasets: [
      {
        label: "Classes",
        data: filteredClasses.map(() => 1),
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#f44336"],
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const subjectsData = {
    labels: filteredSubjects.map((subject) => subject.subject_name),
    datasets: [
      {
        label: "Subjects",
        data: filteredSubjects.map(() => 1),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}

      <Typography variant="h4" gutterBottom>
        Pawara Institute Dashboard
      </Typography>

      {/* Search and Refresh Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          label="Search Classes/Subjects"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "70%" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchData}
        >
          Refresh Data
        </Button>
      </Box>

      {instituteDetails && (
        <Box
          sx={{
            position: "relative",
            height: "400px",
            width: "100%",
            background: `url('./images/static/pawara.jpeg')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Box
            sx={{ position: "absolute", bottom: "10px", right: "10px" }}
          >
            <Button onClick={() => setPreview(true)}>
              <PreviewIcon sx={{ color: "#fff", fontSize: "40px" }} />
            </Button>
          </Box>
        </Box>
      )}

      {/* Dashboard Overview */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 3 }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4" color="primary">
              {totalStudents}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 3 }}>
            <Typography variant="h6">Total Teachers</Typography>
            <Typography variant="h4" color="primary">
              {totalTeachers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Classes Overview
            </Typography>
            <Box height={300}>
              <Bar
                data={classesData}
                options={{
                  plugins: {
                    legend: { display: false },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { display: true } },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Subjects Overview
            </Typography>
            <Box height={300}>
              <Bar
                data={subjectsData}
                options={{
                  plugins: {
                    legend: { display: false },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { display: true } },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstituteDashboard;
