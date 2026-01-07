import React, { useState, SyntheticEvent, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  TextField,
  Fade,
  Slider,
} from '@mui/material';

import VenueCard from '../components/Venue/venuecard';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../store/hooks';
import { fetchVenues } from '../store/slices/venuesSlice';
import { fetchEvents } from '../store/slices/eventsSlice';
import { useNavigate } from 'react-router-dom';

export default function VenueEventsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: venues = [], status: venueStatus, error: venueError } = useSelector(
    (state: RootState) => state.venues
  );
  const { data: events = [], status: eventStatus, error: eventError } = useSelector(
    (state: RootState) => state.events
  );

  useEffect(() => {
    if (venueStatus === 'idle') dispatch(fetchVenues());
    if (eventStatus === 'idle') dispatch(fetchEvents());
  }, [dispatch, venueStatus, eventStatus]);

  const [tabValue, setTabValue] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(500);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchTerm('');
    setSelectedLocation('');
    setMaxPrice(500);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setMaxPrice(newValue as number);
  };

  const filteredVenues = venues.filter((venue) => {
    const matchesName = venue.venue_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === '' || venue.location === selectedLocation;
    return matchesName && matchesLocation;
  });

  const filteredEvents = events.filter((event) => {
    const matchesName = event.event_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === '' || event.location === selectedLocation;
    const matchesPrice = event.ticket_price <= maxPrice;
    return matchesName && matchesLocation && matchesPrice;
  });

  const loading = (tabValue === 0 && venueStatus === 'loading') || (tabValue === 1 && eventStatus === 'loading');
  const error = tabValue === 0 ? venueError : eventError;

  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container sx={{ minHeight: '100vh', width: '100vw', margin: 0, display: 'flex', flexWrap: 'nowrap' }}>
      <Grid item xs={12} sm={4} md={3} lg={2} sx={{ minHeight: '100vh', borderRight: '1px solid #ccc', flexShrink: 0 }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          <Box mb={3}>
            <TextField
              label={tabValue === 0 ? 'Search Venue' : 'Search Event'}
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Box>

          {tabValue === 1 && (
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Max Ticket Price: ${maxPrice}
              </Typography>
              <Slider
                value={maxPrice}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={500}
                step={10}
              />
            </Box>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} sm={8} md={9} lg={10} sx={{ display: 'flex', flexDirection: 'column', width: '100%', flexGrow: 1, minHeight: '100vh' }}>
        <Box p={2} flexGrow={1} paddingRight={5}>
          <Tabs value={tabValue} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
            <Tab label="Venues" />
            <Tab label="Events" />
          </Tabs>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
            <Typography variant="h5">
              {tabValue === 0 ? 'Venues' : 'Events'}
            </Typography>
          </Box>

          <Fade in timeout={500}>
            <Grid container spacing={3} sx={{ flexGrow: 1 }}>
              {loading ? (
                <Typography variant="body1" sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
                  Loading...
                </Typography>
              ) : tabValue === 0 ? (
                filteredVenues.length > 0 ? (
                  filteredVenues.slice(0, 6).map((venue, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <VenueCard venue={venue} 
                           onClick={() => navigate(`/venue/${venue.id}`)}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="h6" sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
                    No venues found for the selected filters.
                  </Typography>
                )
              ) : filteredEvents.length > 0 ? (
                filteredEvents.slice(0, 6).map((event, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <VenueCard
                      venue={{
                        id: event.id,
                        venue_name: event.event_name,
                        location: event.location,
                        description: event.description,
                        image: event.image_url,
                      }}
                      onClick={() => navigate(`/event/${event.id}`)}
                    />
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
                  No events found for the selected filters.
                </Typography>
              )}
            </Grid>
          </Fade>
        </Box>
      </Grid>
    </Grid>
  );
}
