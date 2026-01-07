import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, Chip } from '@mui/material';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
  extendedProps?: {
    type: 'venue_booking' | 'event' | 'unavailable';
    venue?: string;
    sport?: string;
    price?: number;
  };
}

interface VenueSport {
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
  sports: VenueSport[];
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
}

interface BookingCalendarProps {
  venues: Venue[];
  events: Event[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ venues, events }) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const venueBookings: CalendarEvent[] = venues.flatMap(venue => 
      venue.sports.map(sport => ({
        id: `venue-${venue.id}-${sport.id}`,
        title: `${venue.venue_name} - ${sport.sport_name}`,
        start: new Date().toISOString().split('T')[0], 
        color: '#2196f3',
        extendedProps: {
          type: 'venue_booking',
          venue: venue.venue_name,
          sport: sport.sport_name,
          price: sport.price_per_court
        }
      }))
    );

    const eventBookings: CalendarEvent[] = events.map(event => ({
      id: `event-${event.id}`,
      title: event.event_name,
      start: event.date, 
      color: '#4caf50',
      extendedProps: {
        type: 'event',
        venue: event.location,
        price: event.ticket_price
      }
    }));

    setCalendarEvents([...venueBookings, ...eventBookings]);
  }, [venues, events]);

  const handleEventClick = (info: any) => {
    const event = info.event;
    const type = event.extendedProps.type;
    const details = type === 'event' 
      ? `Event at ${event.extendedProps.venue} - $${event.extendedProps.price}`
      : `${event.extendedProps.sport} at ${event.extendedProps.venue} - $${event.extendedProps.price}/hr`;
    alert(details);
  };

  const renderEventContent = (eventInfo: any) => {
    const type = eventInfo.event.extendedProps.type;
    return (
      <Box sx={{ 
        p: 0.5,
        backgroundColor: type === 'venue_booking' ? '#bbdefb' : '#4caf50',
        borderRadius: '4px',
        width: '100%',
        overflow: 'hidden'
      }}>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: type === 'venue_booking' ? '#000' : '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {eventInfo.event.title}
        </Typography>
        <Chip
          label={type === 'venue_booking' ? 'Venue' : 'Event'}
          size="small"
          sx={{ 
            height: '16px',
            fontSize: '0.6rem',
            backgroundColor: type === 'venue_booking' ? '#90caf9' : '#66bb6a',
            color: type === 'venue_booking' ? '#000' : '#fff',
            '& .MuiChip-label': {
              padding: '0 4px'
            }
          }}
        />
      </Box>
    );
  };

  return (
    <Box sx={{ height: '700px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={calendarEvents}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        dayMaxEvents={4}
        moreLinkContent={(args) => `+${args.num} more`}
        height="100%"
        eventDisplay="block"
        eventOverlap={false}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
      />
    </Box>
  );
};

export default BookingCalendar; 