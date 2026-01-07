import React from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";

interface EventData {
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  ticket_price: number;
  image_url: string;
  total_capacity: number;
}

interface EventReviewProps {
  eventData: EventData;
}

const EventReview: React.FC<EventReviewProps> = ({ eventData }) => {
  return (
    <Paper sx={{ p: 3, width: "100%", maxWidth: 600 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Review Event Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              <strong>Event Name:</strong> {eventData.event_name}
            </Typography>
            <Typography>
              <strong>Date:</strong> {eventData.event_date}
            </Typography>
            <Typography>
              <strong>Time:</strong> {eventData.event_time}
            </Typography>
            <Typography>
              <strong>Location:</strong> {eventData.location}
            </Typography>
            <Typography>
              <strong>Description:</strong> {eventData.description}
            </Typography>
            <Typography>
              <strong>Ticket Price:</strong> ${eventData.ticket_price}
            </Typography>
            <Typography>
              <strong>Total Capacity:</strong> {eventData.total_capacity}
            </Typography>
          </Box>
        </Grid>
        {eventData.image_url && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Event Image:
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: "200px",
                overflow: "hidden",
                borderRadius: 1,
                border: '1px solid #ccc',
              }}
            >
              <img
                src={eventData.image_url}
                alt="Event preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default EventReview; 