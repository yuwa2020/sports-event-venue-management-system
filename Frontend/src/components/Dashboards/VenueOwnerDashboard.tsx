import React, { useState, useEffect } from 'react';
import './VenueOwnerDashboard.css';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  Grid,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Drawer,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CalendarMonth,
  List as ListIcon,
  Message as MessageIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  ArrowBack,
  Send,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import BookingCalendar from '../Calendar/BookingCalendar';
import { fetchProfileById } from '../../store/slices/profilesSlice';
import { sendVenueCancellationEmailThunk } from '../../store/slices/emailSlice';
import { fetchOwnerStatsById } from '../../store/slices/venueOwnerStatsSlice';
import ChatInterface from '../Chat/ChatInterface';
import { deleteVenue, fetchVenues } from '../../store/slices/venuesSlice';
import { deleteEvent, fetchEvents } from '../../store/slices/eventsSlice';
import { deleteVenueSportsByVenueId, fetchVenueSportsByVenueId } from '../../store/slices/venueSportsSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
  user_id: number;
}

interface Event {
  id: number;
  event_name: string;
  location: string;
  description: string;
  image: string;
  status: string;
  date: string;
  time: string;
  ticket_price: number;
  total_capacity: number;
  user_id: number;

}

interface DashboardStats {
  total_bookings_current_month: number;
  total_revenue_current_month: number;
  upcoming_events_count: number;
}

// Add interfaces for email service
interface EmailPayload {
  to: string[];
  subject: string;
  template: string;
  data: {
    itemName: string;
    cancellationReason?: string;
    bookingDetails?: {
      date?: string;
      time?: string;
      amount?: number;
    };
    contactEmail?: string;
  };
}

interface CancellationResponse {
  success: boolean;
  message: string;
  emailsSent?: number;
}

interface ChatUser {
  id: number;
  name: string;
  image?: string;
  lastMessage?: string;
  unreadCount?: number;
  type: 'users' | 'venues' | 'events';
  relatedId?: number;
  role?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}



const VenueOwnerDashboard = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSport, setSelectedSport] = useState<{ venueId: number, sport: Sport } | null>(null);
  const [showVenueCancelDialog, setShowVenueCancelDialog] = useState(false);
  const [showEventCancelDialog, setShowEventCancelDialog] = useState(false);
  const [showSportCancelDialog, setShowSportCancelDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showManageListings, setShowManageListings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [chatView, setChatView] = useState<'users' | 'venues' | 'events'>('users');
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Dummy data for now - this should come from API
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('Owner@test.com');
  const [stats, setStats] = useState<DashboardStats>({
    total_bookings_current_month: 8,
    total_revenue_current_month: 12000,
    upcoming_events_count: 3
  });

  const userEmail = "user@test.com"
  //remove this use from

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userId = useSelector((state: any) => state.auth.user?.id);

  const [venues, setVenues] = useState<Venue[]>([]);

  const [events, setEvents] = useState<Event[]>([]);

  const [venueSports, setVenueSports] = useState<{ [venueId: number]: Sport[] }>({});



  const [currentUser, setCurrentUser] = useState<{ id: number; name: string }>({
    id: 20,
    name: 'Venue Owner'
  });

  // Dummy data for calendar events
  const calendarEvents = [
    {
      title: 'Basketball Tournament',
      start: new Date(2024, 2, 25, 10, 0),
      end: new Date(2024, 2, 25, 12, 0),
    },
    {
      title: 'Swimming Competition',
      start: new Date(2024, 2, 26, 14, 0),
      end: new Date(2024, 2, 26, 16, 0),
    },
    // Add more events as needed
  ];

  // Dummy chat users data
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([
    {
      id: 1,
      name: 'John Doe',
      image: 'https://ui-avatars.com/api/?name=John+Doe',
      lastMessage: '', // Will be updated with real data
      unreadCount: 2,
      type: 'users',
      role: 'Customer',
    },
  ]);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const venuesRes = await dispatch(fetchVenues()).unwrap();
        const eventsRes = await dispatch(fetchEvents()).unwrap();
        setVenues(venuesRes);
        setEvents(eventsRes);

        const sportsMap: { [venueId: number]: Sport[] } = {};
        await Promise.all(
          venuesRes.map(async (venue) => {
            try {
              const sports = await dispatch(fetchVenueSportsByVenueId(venue.id)).unwrap();
              sportsMap[venue.id] = sports;
            } catch {
              sportsMap[venue.id] = [];
            }
          })
        );
        setVenueSports(sportsMap);

        const profileRes = await dispatch(fetchProfileById(userId)).unwrap();
        setOwnerName(profileRes.first_name);
        setOwnerEmail(profileRes.email);

        const statsRes = await dispatch(fetchOwnerStatsById(userId)).unwrap();
        setStats(statsRes);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    fetchInitialData();
  }, [dispatch, userId]);




  // useEffect(() => {

  //   const fetchOwnerDetails = async () => {
  //     try {
  //       const res = await dispatch(fetchProfileById(userId)).unwrap();
  //       console.log("Profile fetch response:", res);
  //       setOwnerName(res.first_name);
  //       setOwnerEmail(res.email);
  //     } catch (err) {
  //       console.error("Failed to fetch profile:", err);
  //     }
  //   };

  //   const fetchDashboardStats = async () => {
  //     try {
  //       const res = await dispatch(fetchOwnerStatsById(userId)).unwrap();
  //       console.log("Stats response:", res);
  //       setStats(res); // Make sure res has full stats, not just first_name
  //     } catch (err) {
  //       console.error("Failed to fetch stats:", err);
  //     }
  //   };

  //   fetchOwnerDetails();
  //   fetchDashboardStats();
  // }, [dispatch, userId]);


  const profile = useSelector((state: RootState) => state.profiles.selected);

  console.log(profile?.user_id)
  useEffect(() => {
    if (profile !== null && typeof profile === 'object') {
      setOwnerName(profile.first_name);
      setOwnerEmail(profile.email);
    }
    // Calculate total unread messages
    const total = chatUsers.reduce((sum, user) => sum + (user.unreadCount || 0), 0);
    setUnreadMessages(total);
  }, [chatUsers]);

  // useEffect(() => {
  //   const fetchLastMessages = async () => {
  //     try {
  //       const updatedChatUsers = await Promise.all(
  //         chatUsers.map(async (user) => {
  //           try {
  //             // Find the conversation ID
  //             const conversationResponse = await axios.get(
  //               `http://localhost:3000/api/conversations/find?userId1=${currentUser.id}&userId2=${user.id}`
  //             );
  //             const conversationId = conversationResponse.data.conversationId;

  //             // Fetch the last message
  //             const messageResponse = await axios.get(
  //               `http://localhost:3000/api/conversations/${conversationId}/messages/last`
  //             );
  //             const lastMessage = messageResponse.data?.content || 'No messages yet';

  //             return { ...user, lastMessage };
  //           } catch (error) {
  //             console.error(`Error fetching last message for user ${user.name}:`, error);
  //             return { ...user, lastMessage: 'Error fetching message' };
  //           }
  //         })
  //       );
  //       setChatUsers(updatedChatUsers);
  //     } catch (error) {
  //       console.error('Error fetching last messages:', error);
  //     }
  //   };

  //   fetchLastMessages();
  // }, [currentUser]); // Only run when `currentUser` changes

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditVenue = (venue: Venue) => {
    // Removed authentication for testing
    navigate(`/edit-venue/${venue.id}`, { state: { venue } });
  };

  const handleEditEvent = (event: Event) => {
    // Removed authentication for testing
    navigate(`/edit-event/${event.id}`, { state: { event } });
  };

  const handleCancelVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowVenueCancelDialog(true);
  };

  const handleCancelEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventCancelDialog(true);
  };

  const handleCancelSport = (venueId: number, sport: Sport) => {
    setSelectedSport({ venueId, sport });
    setShowSportCancelDialog(true);
  };


  interface CancellationResponse {
    success: boolean;
    message: string;
    emailsSent?: number;
  }

  const sendCancellationEmails = async (
    type: 'venue' | 'event' | 'sport',
    itemId: number,
    itemName: string,
    userEmail: string,
    ownerEmail: string,
    reason?: any
  ): Promise<CancellationResponse> => {
    try {
      if (type !== 'venue') {
        return {
          success: false,
          message: 'Only venue cancellations are supported in this function.'
        };
      }

      const resultAction = await dispatch(sendVenueCancellationEmailThunk({
        userEmail,
        ownerEmail,
        itemId: itemId.toString(),
        itemName,
        reason
      }));

      if (sendVenueCancellationEmailThunk.fulfilled.match(resultAction)) {
        return {
          success: true,
          message: 'Cancellation email sent successfully',
          emailsSent: 2 // Assuming one to user and one to owner
        };
      } else {
        throw new Error(resultAction.payload || 'Unknown error');
      }

    } catch (error: any) {
      console.error('Error sending cancellation emails:', error);
      return {
        success: false,
        message: error.message || 'Failed to send cancellation emails'
      };
    }
  };

  const handleConfirmVenueCancel = async () => {
    if (selectedVenue) {
      try {
        // Delete associated sports first
        await dispatch(deleteVenueSportsByVenueId(selectedVenue.id)).unwrap();
  
        // Then delete the venue
        await dispatch(deleteVenue(selectedVenue.id)).unwrap();
  
        // Update local state
        setVenues((prev) => prev.filter((v) => v.id !== selectedVenue.id));
        setVenueSports((prev) => {
          const newMap = { ...prev };
          delete newMap[selectedVenue.id];
          return newMap;
        });
  
        // Show success
        setSuccessMessage(`Venue "${selectedVenue.venue_name}" and its sports were successfully deleted.`);
        setShowSuccess(true);
      } catch (error) {
        console.error('Error cancelling venue:', error);
        setSuccessMessage('Error occurred during venue cancellation.');
        setShowSuccess(true);
      }
      setShowVenueCancelDialog(false);
      setSelectedVenue(null);
    }
  };
  


  const handleConfirmEventCancel = async () => {
    if (selectedEvent) {
      try {
        // Remove from backend
        await dispatch(deleteEvent(selectedEvent.id)).unwrap();
  
        // Update local state
        setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
  
        // Show message
        setSuccessMessage('Event cancelled and deleted successfully.');
        setShowSuccess(true);
      } catch (error) {
        console.error('Error deleting event:', error);
        setSuccessMessage('Error occurred during event cancellation.');
        setShowSuccess(true);
      }
      setShowEventCancelDialog(false);
      setSelectedEvent(null);
    }
  };
  

  const handleConfirmSportCancel = async () => {
    if (selectedSport) {
      try {
        // First, update the sport status
        setVenueSports((prev) => ({
          ...prev,
          [selectedSport.venueId]: prev[selectedSport.venueId]?.map((s) =>
            s.id === selectedSport.sport.id ? { ...s, status: 'cancelled' } : s
          )
        }));
        

        // Send cancellation emails
        const emailResult = await sendCancellationEmails(
          'sport',
          selectedSport.sport.id,
          `${selectedSport.sport.sport_name} at ${venues.find(v => v.id === selectedSport.venueId)?.venue_name}`,
          ownerEmail,
          userEmail
        );

        // Show appropriate message
        setSuccessMessage(
          emailResult.success
            ? `Sport cancelled and ${emailResult.emailsSent} users notified`
            : 'Sport cancelled but there was an issue sending notifications'
        );
        setShowSuccess(true);
      } catch (error) {
        console.error('Error during sport cancellation:', error);
        setSuccessMessage('Error occurred during cancellation');
        setShowSuccess(true);
      }
      setShowSportCancelDialog(false);
      setSelectedSport(null);
    }
  };

  const handleVenueStatusChange = (venueId: number, status: string) => {
    setVenues(venues.map(venue =>
      venue.id === venueId
        ? { ...venue, status: status }
        : venue
    ));
  };

  const handleSportStatusChange = (venueId: number, sportId: number, status: string) => {
    setVenues(venues.map(venue =>
      venue.id === venueId
        ? {
          ...venue,
          sports: venue.sports.map(sport =>
            sport.id === sportId
              ? { ...sport, status: status }
              : sport
          )
        }
        : venue
    ));
  };

  const handleManageListings = () => {
    setShowManageListings(true);
  };

  const handleViewCalendar = () => {
    setShowCalendar(true);
  };

  const handleChatOpen = (user: ChatUser) => {
    setSelectedChat(user);
    setShowChat(true);
  };

  const handleChatClose = () => {
    setShowChat(false);
    setSelectedChat(null);
  };

  const renderVenues = () => (

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {venues
        .filter((venue) => venue?.user_id == profile?.user_id)
        .map((venue) => (
          <Card key={venue.id} sx={{ boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{venue.venue_name}</Typography>
                <Box>
                  {/* <Chip
                    label={venue.status}
                    color={venue.status === 'active' ? 'success' : 'error'}
                    size="small"
                    sx={{ mr: 1 }}
                  /> */}
                  <IconButton
                    onClick={() => handleEditVenue(venue)}
                    size="small"
                    sx={{ color: 'primary.main', mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleCancelVenue(venue)}
                    size="small"
                    sx={{ color: 'error.main' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                {venue.location}
              </Typography>
              <Typography variant="body2" paragraph>
                {venue.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(venueSports[venue.id] ?? []).map((sport) => (
                  <Chip
                    key={sport.id}
                    label={`${sport.sport_name} - $${sport.price_per_court}/hr`}
                    color={sport.status === 'active' ? 'primary' : 'primary'}
                    variant="outlined"
                    onDelete={sport.status === 'active' ? () => handleCancelSport(venue.id, sport) : undefined}
                  />
                ))}
              </Box>

            </CardContent>
          </Card>
        ))}
    </Box>
  );


  const renderEvents = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {events
        .filter((event) => event.user_id === profile?.user_id)
        .map((event) => (
          <Card key={event.id} sx={{ boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{event.event_name}</Typography>
                <Box>
                  <Chip
                    label={event.status}
                    color={event.status === 'active' ? 'success' : 'error'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    onClick={() => handleEditEvent(event)}
                    size="small"
                    sx={{ color: 'primary.main', mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleCancelEvent(event)}
                    size="small"
                    sx={{ color: 'error.main' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                {event.location} - {event.date} {event.time}
              </Typography>
              <Typography variant="body2" paragraph>
                {event.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Ticket Price: ${event.ticket_price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capacity: {event.total_capacity}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
    </Box>
  );


  const renderManageListings = () => (
    <Dialog
      open={showManageListings}
      onClose={() => setShowManageListings(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Manage Listings</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Bookings</TableCell>
                <TableCell>Revenue</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell>{venue.venue_name}</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>
                    <Chip
                      label={venue.status}
                      color={venue.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>$0</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditVenue(venue)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleCancelVenue(venue)} size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.event_name}</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>
                    <Chip
                      label={event.status}
                      color={event.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>$0</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditEvent(event)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleCancelEvent(event)} size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowManageListings(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const ChatSidebar = () => (
    <Drawer
      anchor="right"
      open={showChat}
      onClose={() => setShowChat(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 320,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{
        p: 2,
        bgcolor: '#2196f3',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedChat ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => setSelectedChat(null)} size="small" sx={{ color: 'white' }}>
                  <ArrowBack />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                    {selectedChat.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedChat.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {selectedChat.type === 'users' ? 'Customer' : selectedChat.type === 'venues' ? 'Venue Chat' : 'Event Chat'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton onClick={() => setShowChat(false)} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="h6">Messages</Typography>
              <IconButton onClick={() => setShowChat(false)} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </>
          )}
        </Box>
        {!selectedChat && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant={chatView === 'users' ? 'contained' : 'outlined'}
              onClick={() => setChatView('users')}
              startIcon={<PersonIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&.MuiButton-contained': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              Users
            </Button>
            <Button
              size="small"
              variant={chatView === 'venues' ? 'contained' : 'outlined'}
              onClick={() => setChatView('venues')}
              startIcon={<GroupIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&.MuiButton-contained': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              Venues
            </Button>
            <Button
              size="small"
              variant={chatView === 'events' ? 'contained' : 'outlined'}
              onClick={() => setChatView('events')}
              startIcon={<CalendarMonth />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&.MuiButton-contained': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              Events
            </Button>
          </Box>
        )}
      </Box>
      {!selectedChat ? (
        <List sx={{ pt: 0 }}>
          {chatUsers
            .filter(user => user.type === chatView)
            .map((user) => (
              <ListItem
                key={user.id}
                component="div"
                onClick={() => handleChatOpen(user)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color="error"
                    badgeContent={user.unreadCount}
                    invisible={!user.unreadCount}
                  >
                    <Avatar src={user.image} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">{user.name}</Typography>
                      {user.role && (
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={user.lastMessage}
                  secondaryTypographyProps={{
                    noWrap: true,
                    variant: 'body2',
                  }}
                />
              </ListItem>
            ))}
        </List>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 72px)' }}>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            {/* Chat messages will be rendered here */}
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      )}
    </Drawer>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {ownerName}!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Bookings this Month
            </Typography>
            <Typography variant="h3">
              {stats.total_bookings_current_month}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Revenue Generated
            </Typography>
            <Typography variant="h3">
              ${stats.total_revenue_current_month}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <Typography variant="h3">
              {stats.upcoming_events_count}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<ListIcon />}
          onClick={handleManageListings}
          sx={{ flex: 1 }}
        >
          Manage Listings
        </Button>
        <Button
          variant="outlined"
          startIcon={<CalendarMonth />}
          onClick={handleViewCalendar}
          sx={{ flex: 1 }}
        >
          View Calendar
        </Button>
        <Button
          variant="outlined"
          startIcon={<MessageIcon />}
          onClick={() => setShowChat(true)}
          sx={{ flex: 1 }}
        >
          Messages {unreadMessages > 0 && `(${unreadMessages})`}
        </Button>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="MY VENUES" />
            <Tab label="MY EVENTS" />
          </Tabs>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              // Removed authentication for testing
              navigate(tabValue === 0 ? '/create-venue' : '/create-event');
            }}
            sx={{ borderRadius: '20px' }}
          >
            Add {tabValue === 0 ? 'New Venue' : 'New Event'}
          </Button>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderVenues()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderEvents()}
        </TabPanel>
      </Box>

      <Dialog open={showVenueCancelDialog} onClose={() => setShowVenueCancelDialog(false)}>
        <DialogTitle>
          Cancel Venue
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel {selectedVenue?.venue_name}?
            This will notify all users who have made bookings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVenueCancelDialog(false)}>No, Keep It</Button>
          <Button onClick={handleConfirmVenueCancel} color="error">
            Yes, Cancel Venue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEventCancelDialog} onClose={() => setShowEventCancelDialog(false)}>
        <DialogTitle>
          Cancel Event
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel {selectedEvent?.event_name}?
            This will notify all users who have made bookings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEventCancelDialog(false)}>No, Keep It</Button>
          <Button onClick={handleConfirmEventCancel} color="error">
            Yes, Cancel Event
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showSportCancelDialog} onClose={() => setShowSportCancelDialog(false)}>
        <DialogTitle>
          Cancel Sport
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel {selectedSport?.sport.sport_name} at {venues.find(v => v.id === selectedSport?.venueId)?.venue_name}?
            This will notify all users who have booked this sport.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSportCancelDialog(false)}>No, Keep It</Button>
          <Button onClick={handleConfirmSportCancel} color="error">
            Yes, Cancel Sport
          </Button>
        </DialogActions>
      </Dialog>

      {renderManageListings()}

      <Dialog
        open={showCalendar}
        onClose={() => setShowCalendar(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Booking Calendar</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 600, mt: 2 }}>
            <BookingCalendar venues={venues} events={events} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCalendar(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Chat Interface */}
      <ChatSidebar />
      {selectedChat && (
        <ChatInterface
          isOpen={showChat}
          onClose={handleChatClose}
          currentUser={{
            id: 2, // venue owner id
            name: 'Joy Williams' // venue owner name
          }}
          otherUser={{
            id: selectedChat.id,
            name: selectedChat.name,
            image: selectedChat.image
          }}
          eventOrVenueName={selectedChat.type !== 'users' ? selectedChat.name : undefined}
          position="right"
          width={350}
          showChatTabs={false}
          onBackClick={() => setSelectedChat(null)}
        />
      )}
    </Container>
  );
};

export default VenueOwnerDashboard;
