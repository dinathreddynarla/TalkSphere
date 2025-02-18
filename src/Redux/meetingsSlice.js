import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFreshToken } from '../services/authService';
import axios from 'axios';
import Cookies from 'js-cookie';
import { baseUrl } from '../App';
// Fetch meetings
export const fetchMeetings = createAsyncThunk('meetings/fetchMeetings', async (_, { rejectWithValue }) => {
  try {
    const token = await getFreshToken();
    const response = await axios.get(`${baseUrl}/meetings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    // Returning the error message to ensure serializable data
    return rejectWithValue(err.message || 'An error occurred while fetching meetings');
  }
});

// Add a meeting
export const addMeeting = createAsyncThunk('meetings/addMeeting', async (formData, { rejectWithValue }) => {
  try {
    const token = await getFreshToken();
    //console.log(formData);
    
    const response = await axios.post(
      `${baseUrl}/meetings`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    // Return serializable error message
    return rejectWithValue(err.message || 'An error occurred while adding the meeting');
  }
});

// Edit a meeting
export const editMeeting = createAsyncThunk('meetings/editMeeting', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const token = await getFreshToken();
    const response = await axios.put(
      `${baseUrl}/meetings/${id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    // Return serializable error message
    return rejectWithValue(err.message || 'An error occurred while editing the meeting');
  }
});

// Delete a meeting
export const deleteMeeting = createAsyncThunk('meetings/deleteMeeting', async (id, { rejectWithValue }) => {
  try {
    const token = await getFreshToken();
    await axios.delete(`${baseUrl}/meetings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err) {
    console.log(err);
    // Return serializable error message
    return rejectWithValue(err.message || 'An error occurred while deleting the meeting');
  }
});

const meetingsSlice = createSlice({
  name: 'meetings',
  initialState: {
    meetings: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.meetings = action.payload;
      })
      .addCase(addMeeting.fulfilled, (state, action) => {
        state.meetings.push(action.payload);
      })
      .addCase(editMeeting.fulfilled, (state, action) => {
        const index = state.meetings.findIndex((meeting) => meeting._id === action.payload._id);
        if (index !== -1) state.meetings[index] = action.payload;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.meetings = state.meetings.filter((meeting) => meeting._id !== action.payload);
      })
      // Handling errors (rejected case)
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.error = action.payload; // Store the error message
      })
      .addCase(addMeeting.rejected, (state, action) => {
        state.error = action.payload; // Store the error message
      })
      .addCase(editMeeting.rejected, (state, action) => {
        state.error = action.payload; // Store the error message
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.error = action.payload; // Store the error message
      });
  },
});

export default meetingsSlice.reducer;
