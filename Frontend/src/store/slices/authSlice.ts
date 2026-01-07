import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApiClient } from '../../api/apiClient';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  loading: boolean;
  error: string | null;
  requires2FA?: boolean;
  authUrl?: string;
  id: number | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  userRole: null,
  loading: false,
  error: null,
  requires2FA: false,
  authUrl: undefined,
  id: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    {
      email,
      password,
      role,
      captchaToken,
    }: {
      email: string;
      password: string;
      role?: string;
      captchaToken: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApiClient.post('/login', {
        email,
        password,
        role,
        captchaToken,
      }, { withCredentials: true });

      return { ...response.data, role };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    {
      username,
      email,
      password,
      role,
      captchaToken,
    }: {
      username: string;
      email: string;
      password: string;
      role: string;
      captchaToken: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = '/register';
      const response = await authApiClient.post(endpoint, {
        username,
        email,
        password,
        role,
        captchaToken,
      }, { withCredentials: true });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const verifyDuo = createAsyncThunk(
  'auth/verifyDuo',
  async (
    payload: { code: string | null; state: string | null },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApiClient.post('/duo/callback', payload, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "2FA verification failed");
    }
  }
);

export const sendPasswordResetEmail = createAsyncThunk(
  'auth/sendPasswordResetEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApiClient.post('/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userRole = null;
      state.requires2FA = false;
      state.authUrl = undefined;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
        state.userRole = action.payload.user?.role || null;
        state.isAuthenticated = !!action.payload.token;
        state.requires2FA = action.payload.requires2FA || false;
        state.authUrl = action.payload.authUrl;
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyDuo.fulfilled, (state, action) => {
        state.requires2FA = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.user?.role || null;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(verifyDuo.rejected, (state, action) => {
        state.error = action.payload as string;
        state.requires2FA = true;
      })
      .addCase(sendPasswordResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
