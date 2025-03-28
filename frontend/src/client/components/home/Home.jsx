// Home.js
import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Paper,
} from "@mui/material";
import { School, People, AutoStories } from "@mui/icons-material";
import Carousel from "./carousel/Carousel";
import Gallery from "./gallery/Gallery";

const Home = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Carousel Section */}
      <Carousel />

      {/* About Us Section */}
      <Box sx={{ py: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography sx={{ paddingX: "70px" }} variant="body1" color="text.secondary">
          At Pawara Institute, we pride ourselves on offering a comprehensive education with more than 20 highly
          qualified educators. Our institute serves over 600 students, providing a full range of subjects from grades
          1 to 13. Our teachers are dedicated to fostering an engaging and supportive learning environment.
        </Typography>
      </Box>

      {/* Highlights Section */}
      <Box sx={{ py: 5, textAlign: "center", bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { icon: <School fontSize="large" />, title: "Expert Educators", description: "20+ Highly qualified educators dedicated to student success." },
            { icon: <People fontSize="large" />, title: "600+ Students", description: "We empower students from Grades 1 to 13 with a diverse curriculum." },
            { icon: <AutoStories fontSize="large" />, title: "Innovative Learning", description: "Hands-on learning with the latest educational advancements." },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ p: 3, boxShadow: 3, transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.description}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      

      {/* Testimonials Section */}
      <Box sx={{ py: 5, textAlign: "center", bgcolor: "#f9f9f9" }}>
        <Typography variant="h4" gutterBottom>
          What Parents Say
        </Typography>
        <Paper sx={{ maxWidth: 600, mx: "auto", p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="body1" color="text.secondary">
            "This institute has been a fantastic experience for my children. The faculty is supportive, and the programs are enriching!"
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            - Parent of Grade 3 Student
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;
