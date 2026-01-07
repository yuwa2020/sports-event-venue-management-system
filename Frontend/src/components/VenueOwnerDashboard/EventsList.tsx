import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Edit, Delete, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { deleteEvent } from '../../store/slices/eventsSlice';
import { useDispatch } from 'react-redux';
import { sendEventCancellationEmailThunk } from '../../store/slices/emailSlice';

interface Event {
  id: number;
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  ticket_price: number;
  total_capacity: number;
  image_url: string;
  status: string;
}

interface EventsListProps {
  events: Event[];
  onEventStatusChange: (eventId: number, status: string) => void;
}



const EventsList: React.FC<EventsListProps> = ({
  events,
  onEventStatusChange,
}) => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleEdit = (event: Event) => {
    navigate(`/edit-event/${event.id}`);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, eventItem: Event) => {
    setSelectedEvent(eventItem);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };


  const handleCancelEvent = async () => {
    if (!selectedEvent) return;
  
    try {
      // 1. Cancel the event from DB
      await dispatch(deleteEvent(selectedEvent.id)).unwrap();
  
      // 2. Update status in UI/state
      onEventStatusChange(selectedEvent.id, 'cancelled');
  
      // 3. Dispatch email
      await dispatch(sendEventCancellationEmailThunk({
        eventId: selectedEvent.id.toString(),
        eventName: selectedEvent.event_name,
        eventDate: selectedEvent.event_date,
        eventTime: selectedEvent.event_time,
        userEmail: 'user@example.com',      // replace with actual user email
        ownerEmail: 'owner@example.com'     // replace with actual owner email
      }));
  
      console.log('Event cancellation email sent');
  
    } catch (err) {
      console.error('Error during event cancellation:', err);
    }
  
    setCancelDialogOpen(false);
    handleMenuClose();
  };
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {events.map((event) => (
        <Card key={event.id}>
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
                <IconButton onClick={(e) => handleMenuClick(e, event)}>
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>
            <Typography color="textSecondary" gutterBottom>
              {new Date(event.event_date).toLocaleDateString()} at {event.event_time}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {event.location}
            </Typography>
            <Typography variant="body2" paragraph>
              {event.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2">
                <strong>Ticket Price:</strong> ${event.ticket_price}
              </Typography>
              <Typography variant="body2">
                <strong>Capacity:</strong> {event.total_capacity}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedEvent) handleEdit(selectedEvent);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} /> Edit Event
        </MenuItem>
        <MenuItem onClick={() => {
          setCancelDialogOpen(true);
          handleMenuClose();
        }}>
          <Delete sx={{ mr: 1 }} /> Cancel Event
        </MenuItem>
      </Menu>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this event? This will notify all users who have booked tickets.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep It</Button>
          <Button onClick={handleCancelEvent} color="error">
            Yes, Cancel Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventsList; 