import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Button,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchVenueBookings } from '../store/slices/venueBookingsSlice';
import { fetchEventBookings } from '../store/slices/eventBookingsSlice';
import { fetchVenues } from '../store/slices/venuesSlice';
import { fetchEvents } from '../store/slices/eventsSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const VenueOwnerBookings = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const userId = useSelector((state: RootState) => state.profiles.selected?.user_id);

  useEffect(() => {
    dispatch(fetchVenueBookings());
    dispatch(fetchEventBookings());
    dispatch(fetchVenues());
    dispatch(fetchEvents());
  }, [dispatch]);
  

  const ownerId = useSelector((state: RootState) => state.profiles.selected?.user_id);

  const venues = useSelector((state: RootState) => state.venues.data);
  const events = useSelector((state: RootState) => state.events.data);
  const venueBookings = useSelector((state: RootState) => state.venueBookings.data);
  const eventBookings = useSelector((state: RootState) => state.eventBookings.data);
  
  const ownedVenueIds = venues.filter(v => v.user_id === ownerId).map(v => v.id);
  console.log('Owned Venue IDs:', ownedVenueIds);
  
  const ownedEventIds = events.filter(e => e.user_id === ownerId).map(e => e.id);
  console.log('Owned Event IDs:', ownedEventIds);
  
  const filteredVenueBookings = venueBookings.filter(b => ownedVenueIds.includes(b.venue_id));
  console.log('Filtered Venue Bookings:', filteredVenueBookings);
  
  const filteredEventBookings = eventBookings.filter(b => ownedEventIds.includes(b.event_id));
  console.log('Filtered Event Bookings:', filteredEventBookings);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} sx={{ mb: 2 }}>
        <Tab label="Venue Bookings" />
        <Tab label="Event Bookings" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        {filteredVenueBookings.length === 0 ? (
          <Typography>No venue bookings found.</Typography>
        ) : (
          filteredVenueBookings.map((b) => (
            <Paper key={b.id} sx={{ p: 2, mb: 2 }}>
                <Typography><strong>Customer Email:</strong> {b.user_email}</Typography>
              <Typography><strong>Courts:</strong> {b.number_of_courts}</Typography>
              <Typography><strong>Total:</strong> ${b.total_amount}</Typography>
              <Chip label={b.status} color={b.status === 'confirmed' ? 'success' : 'warning'} size="small" />
            </Paper>
          ))
        )}
      </TabPanel>

      <TabPanel value={tab} index={1}>
        {filteredEventBookings.length === 0 ? (
          <Typography>No event bookings found.</Typography>
        ) : (
          filteredEventBookings.map((b) => (
            <Paper key={b.id} sx={{ p: 2, mb: 2 }}>
              <Typography><strong>Customer Email:</strong> {b.user_email}</Typography>
              <Typography><strong>Booking Date:</strong> {b.booking_date}</Typography>
              <Typography><strong>Tickets:</strong> {b.number_of_tickets}</Typography>
              <Typography><strong>Total:</strong> ${b.total_amount}</Typography>
              <Chip label={b.status} color={b.status === 'confirmed' ? 'success' : 'warning'} size="small" />
            </Paper>
          ))
        )}
      </TabPanel>
    </Container>
  );
};

export default VenueOwnerBookings;
