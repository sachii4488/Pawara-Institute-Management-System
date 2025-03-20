// Home.js
import React from "react";
import {
  Container,
  Typography,
  Grid2,
  Card,
  CardContent,
  Box,
  Paper,
} from "@mui/material";
import Carousel from "./carousel/Carousel";
import Gallery from "./gallery/Gallery";

const Home = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Carousel Section */}
      <Carousel />

      {/* Programs Section */}
      <Box sx={{ py: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          About us
        </Typography>
        <Typography  sx={{ paddingX: "70px" }} variant="body1" color="text.secondary">
          At Pawara Institute, we pride ourselves on offering a comprehensive
          education with more than 20 highly qualified educators. Our institute
          serves over 600 students, providing a full range of subjects from
          grades 1 to 13. Our teachers are dedicated to fostering an engaging
          and supportive learning environment, ensuring that every student
          receives the highest quality of education. Whether through innovative
          teaching methods or personalized guidance, we are committed to helping
          each student achieve their full potential.
        </Typography>

        <Typography  sx={{ paddingX: "70px", paddingY:'20px' }} variant="body1" color="text.secondary">
        Our faculty members are more than just instructors—they are mentors and leaders who inspire students to excel academically and personally. They stay at the forefront of educational advancements, continuously updating their skills to provide cutting-edge instruction. At Pawara Institute, we believe that great teachers are the cornerstone of a great education, and we are proud to offer our students access to the very best educators in the country.
        </Typography>
      </Box>

    

      {/* Testimonials Section */}
      {/* <Box sx={{ py: 5, textAlign: 'center', bgcolor: '#f9f9f9' }}>
        <Typography variant="h4" gutterBottom>
          What Parents Say
        </Typography>
        <Box maxWidth="600px" mx="auto" mt={2}>
          <Typography variant="body1" color="text.secondary">
            "This institute has been a fantastic experience for my children. The faculty is supportive, and the programs are enriching!"
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            - Parent of Grade 3 Student
          </Typography>
        </Box>
      </Box> */}
    </Box>
  );
};

export default Home;
