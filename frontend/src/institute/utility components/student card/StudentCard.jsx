/* eslint-disable react/prop-types */

/*import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#fff",
  boxShadow: "none",
  textTransform: "uppercase",
}));
export default function StudentCardAdmin({
  handleEdit,
  student,
  handleDelete,
}) {
  const convertDate = (dateData) => {
    const date = new Date(dateData);
    const dateNu = date.getDate();
    const month = +date.getMonth() + 1;
    const year = date.getFullYear();

    return dateNu + "/" + month + "/" + year;
  };

  useEffect(() => {
    console.log("Student", student);
  }, []);

  return (
    <>
      <Card sx={{ maxWidth: 545, margin: "5px" }}>
        <CardMedia
          component="img"
          alt="Student Image"
          height="360"
          image={`/images/uploaded/student/${student.student_image}`}
        />
        <CardContent>
          <Typography
            component={"div"}
            sx={{ typography: "text.secondary" }}
            variant="h5"
          >
            <b>Name :</b>
            <span>{student.name}</span>
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Student Classes:</b>
            {student.student_classes && student.student_classes.length > 0 ? (
              student.student_classes.join(", ") // Display the class names
            ) : (
              <span>No Classes Assigned</span>
            )}
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Age :</b>
            {student.age}
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Gender :</b>
            {student.gender}
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Guardian :</b>
            {student.guardian}
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Guardian Phone :</b>
            {student.guardian_phone}
          </Typography>
          <Typography component={"div"} variant="p">
            <b>Date of Admission:</b>
            <span>{convertDate(student.createdAt)}</span>{" "}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            sx={{ background: "red", color: "#fff" }}
            onClick={() => {
              handleDelete(student._id);
            }}
          >
            Delete
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{ background: "gold", color: "#222222" }}
            onClick={() => {
              handleEdit(student._id);
            }}
          >
            Edit
          </Button>
        </CardActions>
      </Card>
    </>
  );
}*/

/*import React, { useRef } from "react";


//import { QRCode } from "qrcode.react";
import QRCode from "react-qr-code";
import { Button, Card, CardContent, Typography } from "@mui/material";

const StudentCardAdmin = ({ student, handleDelete, handleEdit }) => {
  const qrRef = useRef();

  // Function to download the QR code image
  const downloadQRCode = () => {
    // Locate the canvas rendered by the QRCode component
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      // Convert the canvas to a data URL (PNG format) and create a temporary link to download it
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${student.name}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Card sx={{ margin: "10px", padding: "10px" }}>
      <CardContent>
        <Typography variant="h5">{student.name}</Typography>
       
        <div ref={qrRef} style={{ margin: "20px 0" }}>
          <QRCode
            value={student._id} // Unique identifier for the student
            renderAs="canvas"
            size={128}
          />
        </div>

       
        <Button variant="contained" color="primary" onClick={downloadQRCode}>
          Download QR Code
        </Button>

       
        <Button variant="outlined" onClick={() => handleEdit(student._id)}>
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(student._id)}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default StudentCardAdmin;*/
/*import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const StudentCard = ({ student, handleDelete, handleEdit }) => {
  // State to control the dialog (popup) visibility
  const [openQr, setOpenQr] = useState(false);
  //const canvas = qrRef.current?.querySelector("canvas");

  // A ref to locate the QR code canvas for download
  const qrRef = useRef(null);

  // Open/close the QR code dialog
  const handleOpenQr = () => setOpenQr(true);
  const handleCloseQr = () => setOpenQr(false);

  // Download QR code from the canvas
  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      //const downloadLink = document.createElement("a");
       // downloadLink.href = pngUrl;
      //downloadLink.download = `${student.name}-qrcode.png`;
      //document.body.appendChild(downloadLink);
      //downloadLink.click();
      //document.body.removeChild(downloadLink);
      const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download =  `${student.name}-qrcode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    }
  };

  return (
    <Card sx={{ margin: "10px", padding: "10px", width: 300 }}>
     
      <CardMedia
        component="img"
        alt="Student"
        height="160"
        image={`/images/uploaded/student/${student.student_image}`}
       
      />

      <CardContent>
        
        <Typography variant="h5" gutterBottom>
          Name : {student.name}
        </Typography>
        <Typography variant="body1">
          Student Classes: {student.student_classes?.join(", ")}
        </Typography>
        <Typography variant="body1">Age : {student.age}</Typography>
        <Typography variant="body1">Gender : {student.gender}</Typography>
        <Typography variant="body1">Guardian : {student.guardian}</Typography>
        <Typography variant="body1">
          Guardian Phone : {student.guardian_phone}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Date of Admission : {student.createdAt || "2025-01-01"}
        </Typography>
      </CardContent>

      <CardActions>
       // Button to open the QR code dialog 
        <Button variant="contained" onClick={handleOpenQr}>
          Show QR Code
        </Button>
        <Button variant="outlined" onClick={() => handleEdit(student._id)}>
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={() => handleDelete(student._id)}>
          Delete
        </Button>
      </CardActions>

     //MUI Dialog to display QR Code when "Show QR Code" is clicked 
        <DialogTitle>QR Code for {student.name}</DialogTitle>
        <DialogContent>
          <div ref={qrRef}>
            <QRCode
              value={student._id || "No ID"}
              //value={student._id & student.email & student_classes & student.name ||"No ID"}
              size={128}
              renderAs="canvas"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={downloadQRCode} variant="contained">
            Download QR Code
          </Button>
          <Button onClick={handleCloseQr} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default StudentCard;*/
import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const StudentCard = ({ student, handleDelete, handleEdit }) => {
  const [openQr, setOpenQr] = useState(false);
  const qrRef = useRef(null);

  // Open/close the QR code dialog
  const handleOpenQr = () => setOpenQr(true);
  const handleCloseQr = () => setOpenQr(false);

  // Download the QR code as a PNG
  const downloadQRCode = () => {
    // Find the SVG element
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    // Serialize the SVG into a string
    const svgData = new XMLSerializer().serializeToString(svg);

    // Create an off-screen canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Create an image to load the SVG data
    const img = new Image();
    img.onload = function () {
      // Resize canvas to match image size
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw the SVG onto the canvas
      ctx.drawImage(img, 0, 0);

      // Convert canvas to PNG data URL
      const pngFile = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      // Create a temporary link to trigger download
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `${student.name}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    // Load the SVG data into the image
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Convert the student data to a JSON string for the QR code
  const qrValue = JSON.stringify({
    id: student._id,
    email: student.email,
    name: student.name,
    classes: student.student_classes,
  });

  return (
    <Card sx={{ margin: "10px", padding: "10px", width: 300 }}>
      <CardMedia
        component="img"
        alt="Student"
        height="160"
        image={`/images/uploaded/student/${student.student_image}`}
      />

      <CardContent>
        <Typography variant="h5" gutterBottom>
          Name: {student.name}
        </Typography>
        <Typography variant="body1">
          Student Classes: {student.student_classes?.join(", ")}
        </Typography>
        <Typography variant="body1">Email: {student.email}</Typography>
        <Typography variant="body1">Age: {student.age}</Typography>
        <Typography variant="body1">Gender: {student.gender}</Typography>
        <Typography variant="body1">Guardian: {student.guardian}</Typography>
        <Typography variant="body1">
          Guardian Phone: {student.guardian_phone}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Date of Admission : {student.createdAt || "2025-01-01"}
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained" onClick={handleOpenQr}>
          Show QR Code
        </Button>
        <Button variant="outlined" onClick={() => handleEdit(student._id)}>
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(student._id)}
        >
          Delete
        </Button>
      </CardActions>

      {/* Dialog to display the QR code */}
      <Dialog open={openQr} onClose={handleCloseQr}>
        <DialogTitle>QR Code for {student.name}</DialogTitle>
        <DialogContent>
          {/* Container to reference the QR code for download */}
          <div ref={qrRef}>
            <QRCode
              value={qrValue} // Embed multiple fields in JSON
              size={128}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={downloadQRCode} variant="contained">
            Download QR Code
          </Button>
          <Button onClick={handleCloseQr} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default StudentCard;

