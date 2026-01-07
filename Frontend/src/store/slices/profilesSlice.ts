import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';

interface Profile {
  id?: number;
  first_name: string;
  last_name: string;
  bio: string;
  phone_number: string;
  city_town: string;
  country: string;
  zipcode: string;
  email: string;
  updated_at?: string;
  user_id?: any;
  
}

interface ProfileState {
  data: Profile[];
  selected: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  data: [],
  selected: null,
  status: 'idle',
  error: null,
};

export const fetchProfiles = createAsyncThunk('profiles/fetchAll', async () => {
  const res = await apiClient.get('/profiles');
  return res.data;
});

export const fetchProfileById = createAsyncThunk('profiles/fetchById', async (id: number) => {
  const res = await apiClient.get(`/profiles/${id}`);
  return res.data;
});

export const createProfile = createAsyncThunk('profiles/create', async (profile: Profile) => {
  const res = await apiClient.post('/profiles', profile);
  return res.data;
});

export const updateProfile = createAsyncThunk('profiles/update', async (profile: Profile) => {
  if (!profile.id) {
    throw new Error('Profile ID is required for updates');
  }
  const res = await apiClient.put(`/profiles/${profile.id}`, profile);
  return res.data;
});

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching profiles';
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export default profilesSlice.reducer;

