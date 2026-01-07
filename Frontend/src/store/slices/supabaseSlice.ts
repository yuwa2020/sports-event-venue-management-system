import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

interface SupabaseState {
  data: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SupabaseState = {
  data: [],
  status: 'idle',
  error: null,
};

// Example async thunk to fetch data from a Supabase table
export const fetchData = createAsyncThunk('supabase/fetchData', async () => {
  const { data, error } = await supabase.from('tbl_venues').select('*');
  if (error) {
    throw error;
  }
  return data;
});

const supabaseSlice = createSlice({
  name: 'supabase',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default supabaseSlice.reducer;
