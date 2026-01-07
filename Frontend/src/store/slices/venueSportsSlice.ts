import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';

interface VenueSport {
  id?: number;
  venue_id: number;
  sport_name: string;
  price_per_court: number;
  total_courts: number; // ← ✅ ADD THIS
  created_at?: string;
  updated_at?: string;
  status?: string; 
}

interface VenueSportState {
  data: VenueSport[];
  selected: VenueSport | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VenueSportState = {
  data: [],
  selected: null,
  status: 'idle',
  error: null,
};

// Get all sports for a venue
export const fetchVenueSportsByVenueId = createAsyncThunk(
  'venueSports/fetchByVenueId',
  async (venue_id: number) => {
    const res = await apiClient.get(`/venue-sports/venue/${venue_id}`);
    return res.data;
  }
);

// Create new sport for a venue
export const createVenueSport = createAsyncThunk(
  'venueSports/create',
  async ({ venue_id, sport }: { venue_id: number; sport: Omit<VenueSport, 'venue_id'> }) => {
    const res = await apiClient.post(`/venue-sports/venue/${venue_id}`, sport);
    return res.data;
  }
);

// Update sport by venue and sport ID
export const updateVenueSport = createAsyncThunk(
  'venueSports/update',
  async ({ venue_id, id, updates }: { venue_id: number; id: number; updates: Partial<VenueSport> }) => {
    const res = await apiClient.put(`/venue-sports/venue/${venue_id}/${id}`, updates);
    return res.data;
  }
);

export const deleteVenueSportsByVenueId = createAsyncThunk(
  'venueSports/deleteByVenueId',
  async (venue_id: number) => {
    await apiClient.delete(`/venue-sports/venue/${venue_id}`);
    return venue_id;
  }
);


const venueSportsSlice = createSlice({
  name: 'venueSports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenueSportsByVenueId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVenueSportsByVenueId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchVenueSportsByVenueId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching venue sports';
      })
      .addCase(createVenueSport.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateVenueSport.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.data.findIndex((v) => v.id === updated.id);
        if (index !== -1) {
          state.data[index] = updated;
        }
      })
      .addCase(deleteVenueSportsByVenueId.fulfilled, (state, action) => {
        state.data = state.data.filter((s) => s.venue_id !== action.payload);
      });
      
  },
});

export default venueSportsSlice.reducer;
