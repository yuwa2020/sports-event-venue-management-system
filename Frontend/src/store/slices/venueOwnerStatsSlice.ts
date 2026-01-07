import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';

interface VenueOwnerStats {
  id?: number;
  user_id: number;
  total_bookings_current_month: number;
  total_revenue_current_month: number;
  upcoming_events_count: number;
  last_updated_at: string;
}

interface VenueOwnerStatsState {
  data: VenueOwnerStats[];
  selected: VenueOwnerStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VenueOwnerStatsState = {
  data: [],
  selected: null,
  status: 'idle',
  error: null,
};

export const fetchOwnerStats = createAsyncThunk('venueOwnerStats/fetchAll', async () => {
  const res = await apiClient.get('/venue-owner-stats');
  return res.data;
});

export const fetchOwnerStatsById = createAsyncThunk('venueOwnerStats/fetchById', async (id: number) => {
  const res = await apiClient.get(`/venue-owner-stats/${id}`);
  return res.data;
});

export const createOwnerStats = createAsyncThunk('venueOwnerStats/create', async (stats: VenueOwnerStats) => {
  const res = await apiClient.post('/venue-owner-stats', stats);
  return res.data;
});

const venueOwnerStatsSlice = createSlice({
  name: 'venueOwnerStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerStats.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchOwnerStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOwnerStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching owner stats';
      })
      .addCase(fetchOwnerStatsById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createOwnerStats.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export default venueOwnerStatsSlice.reducer;
