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
import { fetchVenueById, updateVenue } from '../../store/slices/venuesSlice';
import { useDispatch } from 'react-redux';
import { fetchVenueSportsByVenueId, updateVenueSport } from '../../store/slices/venueSportsSlice';

interface Sport {
  id: number;
  sport_name: string;
  price_per_court: number;
  total_courts: number;
  status: string;
}

interface Venue {
  id: number;
  venue_name: string;
  location: string;
  description: string;
  image: string;
  status: string;
  // ❌ remove: sports: Sport[];
}



const EditVenue = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  // Get venue data from location state or fetch it
  const initialVenue = location.state?.venue || null;

  const [venueData, setVenueData] = useState<Venue>({
    id: 0,
    venue_name: '',
    location: '',
    description: '',
    image: '',
    status: 'active',
  });

  const [venueSports, setVenueSports] = useState<Sport[]>([]);

  useEffect(() => {
    const fetchVenueSports = async () => {
      const sportRes = await dispatch(fetchVenueSportsByVenueId(Number(id))).unwrap();
      setVenueSports(sportRes);
      console.log('Fetched sports:', sportRes);
    };
  
    if (id) {
      fetchVenueSports();
    }
  }, [id]);
  
  useEffect(() => {
    if (initialVenue) {
      setVenueData(initialVenue);

    } else if (id) {
      dispatch(fetchVenueById(Number(id)));
      const fetchVenue = async () => {
        try {
          const res = await dispatch(fetchVenueById(Number(id))).unwrap();
          console.log("Profile fetch response:", res);
          setVenueData(res);




        } catch (err) {
          console.error("Failed to fetch profile:", err);
        }
      };
      fetchVenue();
    }
  }, [id, initialVenue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateVenue({ id: Number(id), updatedVenue: venueData })).unwrap();

      await Promise.all(
        venueSports.map((sport) =>
          dispatch(updateVenueSport({
            venue_id: Number(id),
            id: sport.id,
            updates: sport
          }))
        )
      );
      setShowSuccess(true);
      // Wait for the success message to show before navigating
      setTimeout(() => {
        navigate('/venue-owner-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating venue:', error);
    }
  };

  const handleSportChange = (sportId: number, field: keyof Sport, value: string | number) => {
    setVenueSports(prev =>
      prev.map(sport =>
        sport.id === sportId ? { ...sport, [field]: value } : sport
      )
    );
  };
  

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Venue
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Venue Name"
                value={venueData.venue_name}
                onChange={(e) => setVenueData({ ...venueData, venue_name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={venueData.location}
                onChange={(e) => setVenueData({ ...venueData, location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={venueData.description}
                onChange={(e) => setVenueData({ ...venueData, description: e.target.value })}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Sports
              </Typography>
              {venueSports.map((sport) => (
                <Box key={sport.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Sport Name"
                        value={sport.sport_name}
                        onChange={(e) => handleSportChange(sport.id, 'sport_name', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Price per Court"
                        value={sport.price_per_court}
                        onChange={(e) => handleSportChange(sport.id, 'price_per_court', parseFloat(e.target.value))}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Total Courts"
                        value={sport.total_courts}
                        onChange={(e) => handleSportChange(sport.id, 'total_courts', parseInt(e.target.value))}
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
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
          Venue updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditVenue; 