import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions
} from '@mui/material';

const studentsList = [
  { id: 1, name: 'Nheli Diwaya' },
  { id: 2, name: 'Sachini Natasha' },
  { id: 4, name: 'Saduni Bhagya' },
  { id: 5, name: 'Nimesha Sammani' },
  { id: 6, name: 'Sonali Niduka' },
  { id: 7, name: 'Malsha Wanasinghe' },
  { id: 8, name: 'Isuru Sampath' },
  { id: 9, name: 'Yugan Mihinsa' },
  { id: 10, name: 'Chamika Sithumini' },
];

const mockAttendance = [
  { studentId: 1, date: '2024-03-01T08:30:00', status: 'Present' },
  { studentId: 1, date: '2024-03-02T08:35:15', status: 'Present' },
  { studentId: 2, date: '2024-03-01T08:28:45', status: 'Present' },
];

const classes = [
  { id: 1, name: 'Grade 11 Science (Mrs Iresha)' },
  { id: 2, name: 'Grade 8 Maths (Mr Nayana)' },
  { id: 3, name: 'Grade 11 Maths (Mrs Nayana)' },
  { id: 4, name: 'Grade 6 Sinhala (Mrs Nadeeka)' },
  { id: 5, name: 'Grade 11 Maths (Mr Amith Kumara)' },
  { id: 6, name: 'Grade 5 Tamil (Mrs Tashma)' },
  { id: 7, name: 'Grade 8 History (Mrs Mangalika)' },
  { id: 8, name: 'Grade 03 English (Mr Prasad)' },
  { id: 9, name: 'Grade 11 Dancing (Mrs Nayomi)' },
  { id: 10, name: 'Grade 11 Commerce (Mrs Senani)' },
];

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [message, setMessage] = useState('');

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    const studentAttendance = mockAttendance.filter(
      record => record.studentId === student.id
    );
    setAttendanceDetails(studentAttendance);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Pawara Institute Management System - Student Attendance
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Class
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 2,
          mb: 4
        }}>
          {classes.map(cls => (
            <Button
              key={cls.id}
              variant={selectedClass === cls.id ? 'contained' : 'outlined'}
              onClick={() => setSelectedClass(cls.id)}
              sx={{
                py: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                whiteSpace: 'normal',
                textAlign: 'center'
              }}
            >
              {cls.name}
            </Button>
          ))}
        </Box>
      </Box>

      {selectedClass && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {classes.find(c => c.id === selectedClass)?.name} - Students
          </Typography>
          
          <List sx={{ mb: 4 }}>
            {studentsList.map(student => (
              <ListItem 
                key={student.id} 
                button 
                onClick={() => handleStudentClick(student)}
                sx={{ 
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  mb: 1,
                  borderRadius: 1
                }}
              >
                <ListItemText
                  primary={student.name}
                  secondary="Click to view attendance records"
                />
              </ListItem>
            ))}
          </List>

          {message && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Attendance updates are managed through the mobile application
            </Alert>
          )}
        </Box>
      )}

      <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
        <DialogTitle>
          Attendance Records for {selectedStudent?.name}
        </DialogTitle>
        <DialogContent>
          {attendanceDetails.length > 0 ? (
            attendanceDetails.map((record, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <DialogContentText>
                  <strong>Date:</strong> {formatDateTime(record.date)}
                </DialogContentText>
                <DialogContentText>
                  <strong>Status:</strong> {record.status}
                </DialogContentText>
                <hr style={{ margin: '10px 0' }} />
              </Box>
            ))
          ) : (
            <DialogContentText>
              No attendance records available
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedStudent(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AttendancePage;