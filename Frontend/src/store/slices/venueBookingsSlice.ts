import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';

interface VenueBooking {
  id?: string;
  venue_id: number;
  sport_id: number;
  user_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  number_of_courts: number;
  total_amount: number;
  status: string;
  email_sent: boolean;
  created_at?: string;
  updated_at?: string;
  user_email?: string;
}

interface VenueBookingState {
  data: VenueBooking[];
  selected: VenueBooking | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VenueBookingState = {
  data: [],
  selected: null,
  status: 'idle',
  error: null,
};

export const fetchVenueBookings = createAsyncThunk('venueBookings/fetchAll', async () => {
  const res = await apiClient.get('/venue-bookings');
  return res.data;
});

export const fetchVenueBookingById = createAsyncThunk('venueBookings/fetchById', async (id: string) => {
  const res = await apiClient.get(`/venue-bookings/${id}`);
  return res.data;
});

export const createVenueBooking = createAsyncThunk('venueBookings/create', async (booking: VenueBooking) => {
  const res = await apiClient.post('/venue-bookings', booking);
  return res.data;
});

const venueBookingsSlice = createSlice({
  name: 'venueBookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenueBookings.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchVenueBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchVenueBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching venue bookings';
      })
      .addCase(fetchVenueBookingById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createVenueBooking.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export default venueBookingsSlice.reducer;
