import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';

interface EventBooking {
  id?: string;
  event_id: number;
  user_id: number;
  booking_date: string;
  number_of_tickets: number;
  total_amount: number;
  status: string;
  email_sent: boolean;
  created_at?: string;
  updated_at?: string;
  user_email?: string;
}

interface EventBookingState {
  data: EventBooking[];
  selected: EventBooking | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventBookingState = {
  data: [],
  selected: null,
  status: 'idle',
  error: null,
};

export const fetchEventBookings = createAsyncThunk('eventBookings/fetchAll', async () => {
  const res = await apiClient.get('/event-bookings');
  return res.data;
});

export const fetchEventBookingById = createAsyncThunk('eventBookings/fetchById', async (id: string) => {
  const res = await apiClient.get(`/event-bookings/${id}`);
  return res.data;
});

export const createEventBooking = createAsyncThunk('eventBookings/create', async (booking: EventBooking) => {
  const res = await apiClient.post('/event-bookings', booking);
  return res.data;
});

const eventBookingsSlice = createSlice({
  name: 'eventBookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventBookings.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchEventBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchEventBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching event bookings';
      })
      .addCase(fetchEventBookingById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createEventBooking.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export default eventBookingsSlice.reducer;
