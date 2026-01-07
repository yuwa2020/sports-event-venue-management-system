import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { emailApiClient } from '../../api/apiClient';

// --------------------- Types ---------------------
interface EmailState {
  loading: boolean;
  successMessage: string | null;
  error: string | null;
}

const initialState: EmailState = {
  loading: false,
  successMessage: null,
  error: null,
};

// ----------------- Booking Email Thunk -----------------
export const sendBookingEmailThunk = createAsyncThunk(
  'email/sendBooking',
  async (payload: {
    userEmail: string;
    ownerEmail: string;
    bookingDetails: {
      venue: string;
      date: string;
      time: string;
    };
  }, { rejectWithValue }) => {
    try {
      const res = await emailApiClient.post('/send-booking-emails', payload);
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Booking email failed');
    }
  }
);

// --------------- Venue Cancellation Thunk ----------------
export const sendVenueCancellationEmailThunk = createAsyncThunk(
  'email/sendVenueCancellation',
  async (payload: {
    userEmail: string;
    ownerEmail: string;
    itemId: string;
    itemName: string;
    reason: string;
  }, { rejectWithValue }) => {
    try {
      const res = await emailApiClient.post('/send-cancelled-emails', {
        type: 'venue',
        userEmail: payload.userEmail,
        ownerEmail: payload.ownerEmail,
        data: {
          itemId: payload.itemId,
          itemName: payload.itemName,
          reason: payload.reason,
        }
      });
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Venue cancellation email failed');
    }
  }
);

// --------------- Event Cancellation Thunk ----------------
export const sendEventCancellationEmailThunk = createAsyncThunk(
  'email/sendEventCancellation',
  async (payload: {
    userEmail: string;
    ownerEmail: string;
    eventId: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
  }, { rejectWithValue }) => {
    try {
      const res = await emailApiClient.post('/send-cancelled-emails', {
        type: 'event',
        userEmail: payload.userEmail,
        ownerEmail: payload.ownerEmail,
        data: {
          eventId: payload.eventId,
          eventName: payload.eventName,
          eventDate: payload.eventDate,
          eventTime: payload.eventTime,
        }
      });
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Event cancellation email failed');
    }
  }
);

// --------------------- Slice ---------------------
const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    resetEmailState: (state) => {
      state.loading = false;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Booking Email
      .addCase(sendBookingEmailThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendBookingEmailThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(sendBookingEmailThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Venue Cancellation
      .addCase(sendVenueCancellationEmailThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendVenueCancellationEmailThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(sendVenueCancellationEmailThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Event Cancellation
      .addCase(sendEventCancellationEmailThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendEventCancellationEmailThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(sendEventCancellationEmailThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;
