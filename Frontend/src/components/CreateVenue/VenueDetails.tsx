import React from "react";
import { TextField, Typography, Box, Grid, Paper } from "@mui/material";

interface VenueData {
  venue_name: string;
  location: string;
  description: string;
  image: string;
  sports: Array<{
    sport_name: string;
    price_per_court: number;
    total_courts: number;
  }>;
}

interface VenueDetailsProps {
  venueData: VenueData;
  setVenueData: React.Dispatch<React.SetStateAction<VenueData>>;
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ venueData, setVenueData }) => {
  return (
    <Paper sx={{ p: 3, width: "100%", maxWidth: 600 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Venue Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Venue Name"
            value={venueData.venue_name}
            onChange={(e) =>
              setVenueData({ ...venueData, venue_name: e.target.value })
            }
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Location"
            value={venueData.location}
            onChange={(e) =>
              setVenueData({ ...venueData, location: e.target.value })
            }
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={venueData.description}
            onChange={(e) =>
              setVenueData({ ...venueData, description: e.target.value })
            }
            multiline
            rows={4}
            required
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default VenueDetails; 