import React from "react";
import { TextField, Grid, Typography, Paper, InputAdornment } from "@mui/material";
import { Event } from '../../store/slices/eventsSlice';

interface EventData {
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  ticket_price: number;
  image_url: string;
  total_capacity: number;
  owner_email: string;
  status: string;
  user_id?: number;
}




interface EventDetailsProps {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventData, setEventData }) => {
  return (
    <Paper sx={{ p: 3, width: "100%", maxWidth: 600 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Event Details
          </Typography>
        </Grid>
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
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
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
      </Grid>
    </Paper>
   

    
  );
};

export default EventDetails; 