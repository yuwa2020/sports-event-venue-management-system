import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, CircularProgress, Chip, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Chat as ChatIcon } from '@mui/icons-material';
import {
  TicketBookingDialog,
  AttendeeDetailsDialog,
  OrderSummaryDialog
} from '../components/Booking';
import { getImageUrl } from '../utils/imageUtils';
import { getCoordinatesFromAddress } from '../utils/geocodingUtils';
import MapComponent from '../components/Map/MapComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../store/slices/eventsSlice';
import { RootState } from '../store/store';
import ChatInterface from '../components/Chat/ChatInterface';

// Types for the booking flow
type BookingStep = 'select' | 'details' | 'summary' | null;

interface Coordinates {
  lat: number;
  lng: number;
}

interface EventHost {
  id: number;
  name: string;
  image?: string;
}

export interface Event {
  id?: number;
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  ticket_price: number;
  image_url: string;
  owner_email: string;
  total_capacity: number;
  available_tickets: number;
  status: string;
  user_id?: number;
}


export default function EventDetails() {
  const { id } = useParams();
  const [bookingStep, setBookingStep] = useState<BookingStep>(null);
  const [selectedTickets, setSelectedTickets] = useState({ type: '', quantity: 1, total: 200 });
  const [attendeeDetails, setAttendeeDetails] = useState(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(true);
  const profile = useSelector((state: RootState) => state.profiles.selected)
  const selectedEvent = useSelector((state: RootState) =>
    state.events.data?.find((v) => String(v.id) === String(id))
  );


  const event = (selectedEvent ?? {
    id,
    title: "Sound Of Christmas 2023",
    date: "December 2, 2023",
    time: "7:00 PM",
    location: "1260 Avenue of the Americas, New York, NY 10020",
    description: "Experience the magic of Christmas at the world-famous Radio City Music Hall...",
    ticketPrice: 200,
    image: getImageUrl(id || 'christmas-2023', 'event'),
  }) as Event;




  const dispatch: any = useDispatch();
  //   useEffect(() => {
  //     if (id) {
  //       dispatch(fetchEventById(Number(id)))
  //       .unwrap()
  //       .then((data: any) => {
  //         console.log("Fetched event data:", data);
  //         setEvent(data);
  //       })
  //       .catch((err : any) => {
  //         console.error("Failed to fetch event data:", err);
  //       });
  //   }
  // }, [id, dispatch]);

  console.log("user id" + JSON.stringify(profile?.id))
  console.log("venue/event id" + JSON.stringify(event?.id))


  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | null>(null);
  const [eventHost, setEventHost] = useState<EventHost | null>(null);


  // Fetch coordinates when component mounts or location changes
  useEffect(() => {
    const fetchCoordinates = async () => {
      setIsLoadingCoordinates(true);
      const coords = await getCoordinatesFromAddress(event.location);
      setCoordinates(coords);
      setIsLoadingCoordinates(false);
    };

    fetchCoordinates();
  }, [event.location]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    // Fetch current user
    setCurrentUser({
      id: 1,
      name: 'John Doe'
    });

    // Fetch event host details - This would come from users table via event.user_id
    setEventHost({
      id: 2,
      name: 'Joy Williams', // Venue owner name from users table
      image: 'https://ui-avatars.com/api/?name=Joy+Williams&background=random' // Using UI Avatars for demo
    });

    // Fetch event details
    // setEvent(event);
  }, []);

  const handleBookTickets = () => {
    setBookingStep('select');
  };

  const handleTicketSelection = (type: string, quantity: number, total: number) => {
    setSelectedTickets({ type, quantity, total });
    setBookingStep('details');
  };

  const handleAttendeeDetails = (details: any) => {
    setAttendeeDetails(details);
    setBookingStep('summary');
  };

  const handleClose = () => {
    setBookingStep(null);
    setSelectedTickets({ type: '', quantity: 1, total: 0 });
    setAttendeeDetails(null);
  };

  const handleBack = () => {
    switch (bookingStep) {
      case 'details':
        setBookingStep('select');
        break;
      case 'summary':
        setBookingStep('details');
        break;
      default:
        handleClose();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Image */}
      <Paper
        sx={{
          height: 400,
          mb: 4,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src={event.image_url}
          alt={event.description}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 2
          }}
        />
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Event Title and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              {event.event_name}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBookTickets}
            >
              Book Tickets
            </Button>
          </Box>

          {/* Date and Location */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1 }} />
              <Typography>{event.event_date} at {event.event_time}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography>{event.location}</Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="h6" gutterBottom>
            Event Description
          </Typography>
          <Typography paragraph>
            {event.description}
          </Typography>

          {/* Host Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Hosted by
            </Typography>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 2,
                bgcolor: 'background.default'
              }}
            >
              <Avatar
                src={eventHost?.image}
                alt={eventHost?.name}
                sx={{ width: 56, height: 56 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {eventHost?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Event Organizer
                </Typography>
              </Box>
              {currentUser && eventHost && currentUser.id !== eventHost.id && (
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  onClick={() => setShowChat(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    minWidth: 130
                  }}
                >
                  Chat with Host
                </Button>
              )}
            </Paper>
          </Box>

          {/* Map */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            {isLoadingCoordinates ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : coordinates ? (
              <MapComponent
                center={coordinates}
                markerPosition={coordinates}
                zoom={15}
              />
            ) : (
              <Typography color="error">
                Unable to load map location. Please check the address.
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Ticket Information */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Information
            </Typography>
            <Typography>
              Price per ticket: ₹{event.ticket_price}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Chat Interface */}
      {currentUser && eventHost && (
        <ChatInterface
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          currentUser={currentUser}
          otherUser={eventHost}
          eventOrVenueName={event.event_name}
          position="right"
        />
      )}

      {/* Booking Dialog Flow */}
      <TicketBookingDialog
        open={bookingStep === 'select'}
        onClose={handleClose}
        onConfirm={handleTicketSelection}
        ticketPrice={event.ticket_price}
      />

      <AttendeeDetailsDialog
        open={bookingStep === 'details'}
        onClose={handleClose}
        onBack={handleBack}
        onConfirm={handleAttendeeDetails}
        ticketInfo={selectedTickets}
      />

      <OrderSummaryDialog
        open={bookingStep === 'summary'}
        onClose={handleClose}
        onBack={handleBack}
        ticketInfo={selectedTickets}
        attendeeDetails={attendeeDetails}
        userId={profile?.id}
        venueId={event?.id}
        type="event"
        bookingDate={event?.event_date}
        startTime={event?.event_date}
        ownerEmail={event?.owner_email}//
      />
    </Container>
  );
} 