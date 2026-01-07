import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  CardMedia,
  CircularProgress, Avatar
} from '@mui/material';
import { useParams } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Chat as ChatIcon } from '@mui/icons-material';
import {
  CourtBookingDialog,
  AttendeeDetailsDialog,
  OrderSummaryDialog
} from '../components/Booking';
import { getImageUrl } from '../utils/imageUtils';
import { getCoordinatesFromAddress } from '../utils/geocodingUtils';
import MapComponent from '../components/Map/MapComponent';
import ChatInterface from '../components/Chat/ChatInterface';
import { fetchVenueSportsByVenueId } from '../store/slices/venueSportsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchProfileById } from '../store/slices/profilesSlice';

type BookingStep = 'select' | 'details' | 'summary' | null;

interface Coordinates {
  lat: number;
  lng: number;
}

interface VenueHost {
  id: number;
  name: string;
  image?: string;
}

export default function VenueDetails() {
  const { id } = useParams();
  const [bookingStep, setBookingStep] = useState<BookingStep>(null);
  const [selectedCourts, setSelectedCourts] = useState({ sport: '', courts: 1, total: 500 });
  const [attendeeDetails, setAttendeeDetails] = useState(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | null>(null);
  const [venueHost, setVenueHost] = useState<VenueHost | null>(null);

  // Dummy venue data (replace with API call)
  // const venue = {
  //   id,
  //   title: "Madison Square Garden",
  //   location: "4 Pennsylvania Plaza, New York, NY 10001",
  //   description: "Madison Square Garden, often called 'MSG' or 'The Garden', is a multi-purpose indoor arena in New York City. It is home to the NBA's New York Knicks and NHL's New York Rangers, and hosts numerous sporting events, concerts, and other entertainment events throughout the year.",
  //   image: getImageUrl(id || 'madison-square-garden', 'venue'),
  //   availableSports: [
  //     "Basketball",
  //     "Ice Hockey",
  //     "Boxing",
  //     "Wrestling",
  //     "MMA",
  //     "Indoor Soccer"
  //   ],
  //   courtPrices: {
  //     Basketball: 2000,
  //     "Ice Hockey": 2500,
  //     Boxing: 3000,
  //     Wrestling: 2000,
  //     MMA: 3000,
  //     "Indoor Soccer": 1500
  //   }
  // };

  useEffect(() => {
    // TODO: Replace with actual API calls
    // Fetch current user
    setCurrentUser({
      id: 1,
      name: 'John Doe'
    });
  }, []);

  // Fetch coordinates when component mounts or location changes
  const [venuesports, setVenueSports] = useState<any[] | null>(null);
  const venue = useSelector((state: RootState) => state.venues.data?.find((v) => String(v.id) === String(id)));
  const profile = useSelector((state: RootState) => state.profiles.selected)

  console.log("owner id" + JSON.stringify(venue?.user_id))
  console.log("venue/event id" + JSON.stringify(venue?.id))

  const dispatch: any = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileOwner = await dispatch(fetchProfileById(40)).unwrap();
        console.log("owner info:", JSON.stringify(profileOwner));
        setVenueHost({
          id: profileOwner?.user_id,
          name: profileOwner.first_name,
          image: 'https://ui-avatars.com/api/?name=Joy+Williams&background=random'
        });
  
        if (id) {
          const data = await dispatch(fetchVenueSportsByVenueId(Number(id))).unwrap();
          console.log("Fetched venue sport:", data);
          setVenueSports(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [id, dispatch]);
  

  // const venue = {
  //   id,
  //   title: "Madison Square Garden",
  //   location: "4 Pennsylvania Plaza, New York, NY 10001",
  //   description:
  //     "World-famous arena hosting major sports events, concerts, and entertainment shows. Features state-of-the-art facilities and excellent acoustics.",
  //   image: getImageUrl(id || 'madison-square-garden', 'venue')
  // };

  useEffect(() => {
    const fetchCoordinates = async () => {
      setIsLoadingCoordinates(true);
      const coords = await getCoordinatesFromAddress(venue.location);
      setCoordinates(coords);
      setIsLoadingCoordinates(false);
    };

    fetchCoordinates();
  }, [venue.location]);

  const handleBookCourts = () => {
    setBookingStep('select');
  };

  const handleCourtSelection = (sport: string, courts: number, total: number) => {
    setSelectedCourts({ sport, courts, total });
    setBookingStep('details');
  };

  const handleAttendeeDetails = (details: any) => {
    setAttendeeDetails(details);
    setBookingStep('summary');
  };

  const handleClose = () => {
    setBookingStep(null);
    setSelectedCourts({ sport: '', courts: 1, total: 0 });
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
          src={venue.image}
          alt={venue.title}
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
          {/* Venue Title and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              {venue.title}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleBookCourts}>
              Book Courts
            </Button>
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            <Typography>{venue.location}</Typography>
          </Box>

          {/* Description */}
          <Typography variant="h6" gutterBottom>
            Venue Description
          </Typography>
          <Typography paragraph>{venue.description}</Typography>

          {/* Available Sports */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Available Sports
          </Typography>
          <Grid container spacing={2}>
            {venuesports?.map((sportObj) => (
              <Grid item key={sportObj.id}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography>{sportObj.sport_name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Host Section */}
          <Box sx={{ mt: 4, mb: 4 }}>
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
                src={venueHost?.image}
                alt={venueHost?.name}
                sx={{ width: 56, height: 56 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {venueHost?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Venue Owner
                </Typography>
              </Box>
              {currentUser && venueHost && currentUser.id !== venueHost.id && (
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
              <MapComponent center={coordinates} markerPosition={coordinates} zoom={15} />
            ) : (
              <Typography color="error">Unable to load map location. Please check the address.</Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Court Information */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Court Information
            </Typography>
            <Typography gutterBottom>Price per court varies by sport type:</Typography>
            {venuesports?.map((sportObj) => (
              <Typography key={sportObj.id} sx={{ ml: 2, mb: 0.5 }}>
                • {sportObj.sport_name}: ₹{sportObj.price_per_court}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Chat Interface */}
      {currentUser && venueHost && (
        <ChatInterface
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          currentUser={currentUser}
          otherUser={venueHost}
          eventOrVenueName={venue.title}
          position="right"
        />
      )}

      {/* Booking Dialog Flow */}
      <CourtBookingDialog
        open={bookingStep === 'select'}
        onClose={handleClose}
        onConfirm={handleCourtSelection}
        courtPrices={
          venuesports?.reduce((acc: any, s: any) => {
            acc[s.sport_name] = s.price_per_court;
            return acc;
          }, {}) || {}
        }
        availableSports={venuesports?.map((s: any) => s.sport_name) || []}
      />

      <AttendeeDetailsDialog
        open={bookingStep === 'details'}
        onClose={handleClose}
        onBack={handleBack}
        onConfirm={handleAttendeeDetails}
        ticketInfo={selectedCourts}
      />

      <OrderSummaryDialog
        open={bookingStep === 'summary'}
        onClose={handleClose}
        onBack={handleBack}
        ticketInfo={selectedCourts}
        attendeeDetails={attendeeDetails}
        userId={profile?.id}
        venueId={venue?.id}
        type="venue"
        bookingDate={null}
        startTime={null}
        ownerEmail={venue?.owner_email}
      />


    </Container>
  );
}
