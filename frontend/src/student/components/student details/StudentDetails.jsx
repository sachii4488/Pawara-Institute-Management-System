/*import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";
import "./StudentDetails.css";

export default function StudentDetails() {
  const [student, setStudent] = useState(null);

  const getStudentDetails = () => {
    axios
      .get(`${baseUrl}/student/fetch-own`)
      .then((resp) => {
        setStudent(resp.data.data);
        console.log("student", resp);
      })
      .catch((e) => {
        console.log("Error in student", e);
      });
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  return (
    <>
      <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "15px" }}>
        Student Details
      </Typography>
      {student && (
        <>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "5px",
            }}
          >
            <img
              src={`/images/uploaded/student/${student.student_image}`}
              alt="image"
              height={"370px"}
              width={"450px"}
              style={{ borderRadius: "50%" }}
            />
          </Box>
          <TableContainer
            sx={{
              margin: "auto",
              width: "80%",
              border: "1px solid transparent",
              borderRadius: "17px",
              boxShadow: "0 10px 8px -5px lightgray",
            }}
            component={"div"}
          >
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Email
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.email}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Name
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Class
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.student_classes.length > 0
                      ? student.student_classes
                          .map((cls) => cls.class_text) // Extract `class_text` from each object
                          .join(", ")
                      : "No Classes Assigned"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Age
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.age}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Gender
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.gender}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Guardian
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.guardian}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}*/
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";
import "./StudentDetails.css";

export default function StudentDetails() {
  const [student, setStudent] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMessage, setPassMessage] = useState("");

  const getStudentDetails = () => {
    axios
      .get(`${baseUrl}/student/fetch-own`)
      .then((resp) => {
        setStudent(resp.data.data);
        console.log("student", resp.data.data);
      })
      .catch((e) => {
        console.log("Error in student", e);
      });
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMessage("");
    if (newPassword !== confirmPassword) {
      setPassMessage("Passwords do not match");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("password", newPassword);
      // Assuming updateStudentWithId endpoint handles password update
      await axios.patch(`${baseUrl}/student/update/${student._id}`, formData);
      setPassMessage("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      // Optionally, refresh student details if needed
      getStudentDetails();
    } catch (error) {
      setPassMessage("Error updating password");
      console.error(error);
    }
  };

  return (
    <>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", marginBottom: "15px" }}
      >
        Student Details
      </Typography>
      {student && (
        <>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "5px",
            }}
          >
            <img
              src={`/images/uploaded/student/${student.student_image}`}
              alt="Student"
              height={"370px"}
              width={"450px"}
              style={{ borderRadius: "50%" }}
            />
          </Box>
          <TableContainer
            sx={{
              margin: "auto",
              width: "80%",
              border: "1px solid transparent",
              borderRadius: "17px",
              boxShadow: "0 10px 8px -5px lightgray",
            }}
            component={"div"}
          >
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Unique ID
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.unique_id || "N/A"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    QR Code
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.qr_code ? (
                      <img
                        src={student.qr_code}
                        alt="QR Code"
                        style={{ width: "150px", height: "150px" }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Email
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.email}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Name
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Class
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.student_classes.length > 0
                      ? student.student_classes
                          .map((cls) => cls.class_text)
                          .join(", ")
                      : "No Classes Assigned"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Age
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.age}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Gender
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.gender}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Guardian
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {student.guardian}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="table-cell" align="left">
                    Password
                  </TableCell>
                  <TableCell className="table-cell" align="left">
                    {/* Display masked password */}
                    {"********"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Change Password Section */}
          <Box
            component="form"
            onSubmit={handleChangePassword}
            sx={{
              margin: "20px auto",
              width: "80%",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Change Password
            </Typography>
            <TextField
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passMessage && (
              <Typography variant="body2" color="error" align="center">
                {passMessage}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary">
              Update Password
            </Button>
          </Box>
        </>
      )}
    </>
  );
}

