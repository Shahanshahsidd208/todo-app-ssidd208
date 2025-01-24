import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '../../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpSent: false,
  email: null,
};

// Request OTP
export const requestOTP = createAsyncThunk(
  'auth/requestOTP',
  async (email: string) => {
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send an actual email with OTP
    // For demo, we'll use a fixed OTP: 123456
    return email;
  }
);

// Verify OTP and set up password
export const verifyOTPAndSetPassword = createAsyncThunk(
  'auth/verifyOTPAndSetPassword',
  async ({ email, otp, password }: { email: string; otp: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept only 123456 as valid OTP
    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }

    return {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
    };
  }
);

// Regular login with email and password
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@example.com' && password === 'password') {
      return {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
      };
    }
    throw new Error('Invalid credentials');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.email = null;
    },
    resetAuth: (state) => {
      state.otpSent = false;
      state.email = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request OTP
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.email = action.payload;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send OTP';
      })
      // Verify OTP and set password
      .addCase(verifyOTPAndSetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTPAndSetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.otpSent = false;
        state.email = null;
      })
      .addCase(verifyOTPAndSetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Invalid OTP';
      })
      // Regular login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;