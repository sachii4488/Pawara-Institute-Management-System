import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Typography,
} from '@mui/material';
import AssignPeriod2 from '../../../institute/components/assign period/AssignPeriod2';
import { baseUrl } from '../../../environment';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(''); // Initialize with an empty string
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Fetch all classes
  const fetchAllClasses = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/class/fetch-all`);
      const classes = resp.data.data;
      setAllClasses(classes);
      if (classes.length > 0) {
        setSelectedClass(classes[0]._id); // Default to the first class
      }
    } catch (error) {
      console.error('Error in fetching all Classes:', error);
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);

  // Fetch periods for the selected class
  useEffect(() => {
    const fetchClassPeriods = async () => {
      if (!selectedClass) return;
      try {
        const response = await axios.get(`${baseUrl}/period/class/${selectedClass}`);
        const periods = response.data.periods;
        const eventsData = periods.map((period) => ({
          id: period._id,
          title: `${period.subject?.subject_name || ''}, By ${period.teacher?.name || ''}`,
          start: new Date(period.startTime),
          end: new Date(period.endTime),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching periods:', error);
      }
    };

    fetchClassPeriods();
  }, [selectedClass, openDialog, openAddDialog]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  return (
    <Container>
      <Typography className="hero-text" variant="h2" sx={{ textAlign: 'center' }}>
        Weekly Schedule
      </Typography>

      <Paper sx={{ margin: '10px', padding: '10px' }}>
        <FormControl sx={{ minWidth: '220px', marginTop: '10px' }}>
          <InputLabel>Change Class</InputLabel>
          <Select
            value={selectedClass}
            onChange={handleClassChange}
          >
            {allClasses.map((value) => (
              <MenuItem key={value._id} value={value._id}>
                {value.class_text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddDialog}
        style={{ marginBottom: '10px' }}
      >
        Add New Period
      </Button>

      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['week']}
        step={30}
        timeslots={1}
        min={new Date(1970, 1, 1, 10, 0, 0)}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        max={new Date(1970, 1, 1, 17, 0, 0)}
        defaultDate={new Date()}
        showMultiDayTimes
        style={{ height: '100%', width: '100%' }}
        formats={{ timeGutterFormat: 'hh:mm A' }}
      />

      {/* Modal for Editing Events */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Period</DialogTitle>
        <DialogContent>
          <AssignPeriod2
            classId={selectedClass}
            isEdit={true}
            periodId={selectedEvent}
            close={handleCloseDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Adding New Period */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Period</DialogTitle>
        <AssignPeriod2 classId={selectedClass} close={handleCloseAddDialog} />
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Schedule;
