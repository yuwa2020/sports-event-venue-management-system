import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

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

interface VenueReviewProps {
  venueData: VenueData;
}

const VenueReview: React.FC<VenueReviewProps> = ({ venueData }) => {
  return (
    <div style={{ width: "75%", padding: "10px" }}>
      <h3>Review Venue Information</h3>
      <Grid container spacing={3}>
        {/* Basic Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Details
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Venue Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {venueData.venue_name}
                </Typography>

                <Typography variant="subtitle1" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {venueData.location}
                </Typography>

                <Typography variant="subtitle1" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {venueData.description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Venue Image */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Venue Image
              </Typography>
              {venueData.image ? (
                <Box
                  sx={{
                    mt: 2,
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: 1,
                  }}
                >
                  <img
                    src={venueData.image}
                    alt="Venue"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No image uploaded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sports & Pricing */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sports & Pricing
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sport</TableCell>
                      <TableCell align="right">Price per Court</TableCell>
                      <TableCell align="right">Total Courts</TableCell>
                      <TableCell align="right">Total Capacity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {venueData.sports.map((sport, index) => (
                      <TableRow key={index}>
                        <TableCell>{sport.sport_name}</TableCell>
                        <TableCell align="right">
                          ${sport.price_per_court}
                        </TableCell>
                        <TableCell align="right">{sport.total_courts}</TableCell>
                        <TableCell align="right">
                          {sport.total_courts * 2} players
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default VenueReview; 