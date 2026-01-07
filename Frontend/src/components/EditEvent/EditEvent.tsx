import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchEventById, updateEvent } from '../../store/slices/eventsSlice';

interface Event {
  id: number;
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  ticket_price: number;
  total_capacity: number;
  image_url: string;
  status: string;
}



const EditEvent = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  // Get event data from location state or fetch it
  const initialEvent = location.state?.event || null;

  const [eventData, setEventData] = useState<Event>({
    id: 0,
    event_name: '',
    event_date: '',
    event_time: '',
    location: '',
    description: '',
    ticket_price: 0,
    total_capacity: 0,
    image_url: '',
    status: 'active'
  });

  useEffect(() => {
    if (initialEvent) {
      setEventData(initialEvent);
    } else if (id) {
      const fetchEvent = async () => {
        try {
          const res = await dispatch(fetchEventById(Number(id))).unwrap();
          console.log("Profile fetch response:", res);
          setEventData(res);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        }
      };
      fetchEvent();
    }
  }, [id, initialEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateEvent({ id: Number(id), updatedEvent: eventData })).unwrap();
      setShowSuccess(true);

      setShowSuccess(true);
      // Wait for the success message to show before navigating
      setTimeout(() => {
        navigate('/venue-owner-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Event
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Name"
                value={eventData.event_name}
                onChange={(e) => setEventData({ ...eventData, event_name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Event Date"
                value={eventData.event_date}
                onChange={(e) => setEventData({ ...eventData, event_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Event Time"
                value={eventData.event_time}
                onChange={(e) => setEventData({ ...eventData, event_time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Ticket Price"
                value={eventData.ticket_price}
                onChange={(e) => setEventData({ ...eventData, ticket_price: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Total Capacity"
                value={eventData.total_capacity}
                onChange={(e) => setEventData({ ...eventData, total_capacity: parseInt(e.target.value) })}
                required
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/venue-owner-dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Event updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditEvent; 