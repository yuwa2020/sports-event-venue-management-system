import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';

interface Venue {
  id?: number;
  venue_name: string;
  location: string;
  description: string;
  image: string;
  owner_email: any;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  
}

interface VenueState {
  data: Venue[];
  selected: Venue | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VenueState = {
  data: [],
  selected: null,
  status: 'idle',
  error: null,
};

export const fetchVenues = createAsyncThunk('venues/fetchAll', async () => {
  const res = await apiClient.get('/venues');
  return res.data;
});

export const fetchVenueById = createAsyncThunk('venues/fetchById', async (id: number) => {
  const res = await apiClient.get(`/venues/${id}`);
  return res.data;
});

export const createVenue = createAsyncThunk('venues/create', async (venue: Venue) => {
  const res = await apiClient.post('/venues', venue);
  return res.data;
});

export const updateVenue = createAsyncThunk(
  'venues/update',
  async ({ id, updatedVenue }: { id: number; updatedVenue: Partial<Venue> }) => {
    const res = await apiClient.put(`/venues/${id}`, updatedVenue);
    return res.data;
  }
);

export const deleteVenue = createAsyncThunk(
  'venues/delete',
  async (id: number) => {
    const res = await apiClient.delete(`/venues/${id}`);
    return id; // return the deleted ID
  }
);



const venuesSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenues.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching venues';
      })
      .addCase(fetchVenueById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createVenue.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateVenue.fulfilled, (state, action) => {
        const index = state.data.findIndex((venue) => venue.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.data = state.data.filter((v) => v.id !== action.payload);
      });
      
      
  },
});

export default venuesSlice.reducer;

