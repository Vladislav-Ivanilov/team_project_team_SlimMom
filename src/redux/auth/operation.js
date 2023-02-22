import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'https://slimmom-backend.goit.global';

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  unset() {
    axios.defaults.headers.common.Authorization = '';
  },
};

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/register', credentials);
      token.set(data.accessToken);
      return data;
    } catch (error) {
      return rejectWithValue(error.massage);
    }
  }
);

export const login = createAsyncThunk('auth/login', async credentials => {
  try {
    const { data } = await axios.post('/auth/login', credentials);
    token.set(data.accessToken);
    return data;
  } catch (error) {
    return credentials.rejectWithValue(error.massage);
  }
});

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/logout');
      token.unset();
      return data;
    } catch (error) {
      return rejectWithValue(error.massage);
    }
  }
);

export const sessionRefreshing = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const persistedSid = { sid: state.auth.sid };

    if (persistedSid === null) {
      return rejectWithValue('Ops...');
    }
    try {
      token.set(state.auth.refreshToken);
      const { data } = await axios.post('/auth/refresh', persistedSid);
      token.set(data.newAccessToken);
      return data;
    } catch (error) {
      return rejectWithValue(error.massage);
    }
  }
);
