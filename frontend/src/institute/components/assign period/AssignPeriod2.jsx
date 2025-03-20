
/*import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography
} from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const AssignPeriod = ({ classId, isEdit, periodId, close }) => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacher, setTeacher] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  // Fetch teachers, classes, and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherResponse = await axios.get(`${baseUrl}/teacher/fetch-with-query`, { params: {} });
        const classResponse = await axios.get(`${baseUrl}/class/fetch-all`);
        const subjectResponse = await axios.get(`${baseUrl}/subject/fetch-all`, { params: {} });
        setTeachers(teacherResponse.data.data);
        setClasses(classResponse.data.data);
        setSubjects(subjectResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // If editing, fetch the period details to prefill the form
  useEffect(() => {
    const fetchPeriodDetails = async () => {
      if (isEdit && periodId) {
        try {
          const response = await axios.get(`${baseUrl}/period/${periodId}`);
          const periodData = response.data.period;

          // Populate the form fields
          setTeacher(periodData.teacher._id);
          setSubject(periodData.subject._id);
          setSelectedClassId(periodData.classId);
          // Convert to "YYYY-MM-DDTHH:mm" for datetime-local
          setStartTime(periodData.startTime.substring(0, 16));
          setEndTime(periodData.endTime.substring(0, 16));
        } catch (error) {
          console.error('Error fetching period details:', error);
        }
      }
    };
    fetchPeriodDetails();
  }, [isEdit, periodId]);

  // Create new period assignment
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/period/create`, {
        teacher,
        subject,
        classId: classId || selectedClassId,
        startTime,
        endTime,
      });
      alert('Period assigned successfully');
      setMessage('Period assigned successfully');
      if (close) close();
    } catch (error) {
      console.error('Error assigning period:', error);
      setMessage('Error assigning period');
    }
  };

  // Update an existing period assignment
  const handleUpdate = async () => {
    try {
      await axios.put(`${baseUrl}/period/update/${periodId}`, {
        teacher,
        subject,
        classId: classId || selectedClassId,
        startTime,
        endTime,
      });
      alert('Period updated successfully');
      setMessage('Period updated successfully');
      if (close) close();
    } catch (error) {
      console.error('Error updating period:', error);
      setMessage('Error updating period');
    }
  };

  // Delete an existing period assignment
  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/period/delete/${periodId}`);
      alert('Period deleted successfully');
      setMessage('Period deleted successfully');
      if (close) close();
    } catch (error) {
      console.error('Error deleting period:', error);
      setMessage('Error deleting period');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Update / Delete Period" : "Assign Period to Teacher"}
      </Typography>
      <form onSubmit={isEdit ? (e) => e.preventDefault() : handleCreate}>
       //Teacher Field 
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

        // Subject Field 
        <FormControl fullWidth margin="normal">
          <InputLabel>Subject</InputLabel>
          <Select
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            {subjects.map((s) => (
              <MenuItem key={s._id} value={s._id}>
                {s.subject_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        // Class Field 
        <FormControl fullWidth margin="normal">
          <InputLabel>Class</InputLabel>
          <Select
            label="Class"
            value={classId || selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            required
          >
            {classes.map((cls) => (
              <MenuItem key={cls._id} value={cls._id}>
                {cls.class_text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        // Start Time 
        <TextField
          label="Start Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

       // End Time 
        <TextField
          label="End Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        {isEdit ? (
          <>
            <Button
              onClick={handleDelete}
              color="secondary"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Delete
            </Button>
            <Button onClick={handleUpdate} color="primary" variant="contained">
              Update
            </Button>
          </>
        ) : (
          <Button type="submit" variant="contained" color="primary">
            Assign Period
          </Button>
        )}
      </form>
      {message && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default AssignPeriod;*/
import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography
} from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const AssignPeriod = ({ classId, isEdit, periodId, close }) => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [teacher, setTeacher] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  // Fetch teachers and classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherResponse = await axios.get(`${baseUrl}/teacher/fetch-with-query`, { params: {} });
        const classResponse = await axios.get(`${baseUrl}/class/fetch-all`);
        setTeachers(teacherResponse.data.data);
        setClasses(classResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // If editing, fetch the period details to prefill the form
  useEffect(() => {
    const fetchPeriodDetails = async () => {
      if (isEdit && periodId) {
        try {
          const response = await axios.get(`${baseUrl}/period/${periodId}`);
          const periodData = response.data.period;

          // Populate the form fields
          setTeacher(periodData.teacher._id);
          setSelectedClassId(periodData.classId);

          // Convert to "YYYY-MM-DDTHH:mm" for datetime-local
          setStartTime(periodData.startTime.substring(0, 16));
          setEndTime(periodData.endTime.substring(0, 16));
        } catch (error) {
          console.error('Error fetching period details:', error);
        }
      }
    };
    fetchPeriodDetails();
  }, [isEdit, periodId]);

  // Create new period assignment
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/period/create`, {
        teacher,
        classId: classId || selectedClassId,
        startTime,
        endTime,
      });
      alert('Period assigned successfully');
      setMessage('Period assigned successfully');
      if (close) close();
    } catch (error) {
      console.error('Error assigning period:', error);
      setMessage('Error assigning period');
    }
  };

  // Update an existing period assignment
  const handleUpdate = async () => {
    try {
      await axios.put(`${baseUrl}/period/update/${periodId}`, {
        teacher,
        classId: classId || selectedClassId,
        startTime,
        endTime,
      });
      alert('Period updated successfully');
      setMessage('Period updated successfully');
      if (close) close();
    } catch (error) {
      console.error('Error updating period:', error);
      setMessage('Error updating period');
    }
  };

  // Delete an existing period assignment
  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/period/delete/${periodId}`);
      alert('Period deleted successfully');
      setMessage('Period deleted successfully');
      if (close) close();
    } catch (error) {
      console.error('Error deleting period:', error);
      setMessage('Error deleting period');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Update / Delete Period" : "Assign Period to Teacher"}
      </Typography>
      <form onSubmit={isEdit ? (e) => e.preventDefault() : handleCreate}>
        {/* Teacher Field */}
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

        {/* Class Field */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Class</InputLabel>
          <Select
            label="Class"
            value={classId || selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            required
          >
            {classes.map((cls) => (
              <MenuItem key={cls._id} value={cls._id}>
                {cls.class_text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Start Time */}
        <TextField
          label="Start Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        {/* End Time */}
        <TextField
          label="End Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        {isEdit ? (
          <>
            <Button
              onClick={handleDelete}
              color="secondary"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Delete
            </Button>
            <Button onClick={handleUpdate} color="primary" variant="contained">
              Update
            </Button>
          </>
        ) : (
          <Button type="submit" variant="contained" color="primary">
            Assign Period
          </Button>
        )}
      </form>
      {message && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default AssignPeriod;

