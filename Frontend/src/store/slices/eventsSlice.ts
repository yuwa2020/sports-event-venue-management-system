import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';

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

interface EventState {
  data: Event[];
  selectedEvent: Event | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventState = {
  data: [],
  selectedEvent: null,
  status: 'idle',
  error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchAll', async () => {
  const res = await apiClient.get('/events');
  return res.data;
});

export const fetchEventById = createAsyncThunk('events/fetchById', async (id: number) => {
  const res = await apiClient.get(`/events/${id}`);
  return res.data;
});

export const createEvent = createAsyncThunk('events/create', async (event: Event) => {
  const res = await apiClient.post('/events', event);
  return res.data;
});

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, updatedEvent }: { id: number; updatedEvent: Partial<Event> }) => {
    const res = await apiClient.put(`/events/${id}`, updatedEvent);
    return res.data;
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id: number) => {
    await apiClient.delete(`/events/${id}`);
    return id;
  }
);



const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching events';
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEvent = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.data.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.data = state.data.filter(event => event.id !== action.payload);
      })
      
      
  },
});

export default eventsSlice.reducer;

