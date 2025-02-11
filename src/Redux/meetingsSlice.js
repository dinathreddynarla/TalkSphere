import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFreshToken } from '../services/authService';
import axios from 'axios';
import Cookies from 'js-cookie';

// const token = JSON.parse(Cookies.get('session') || '{}').token;

// Fetch meetings
export const fetchMeetings = createAsyncThunk('meetings/fetchMeetings', async () => {
    try{
        const token = await getFreshToken();
        console.log(token);
        
        const response = await axios.get('https://talksphere-nyay.onrender.com/meetings', {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
    }
    catch(err){
        console.log(err);
        return err
        
    }
  
});

// Add a meeting
export const addMeeting = createAsyncThunk('meetings/addMeeting', async (formData) => {
    try{
        const token = await getFreshToken();
        const response = await axios.post(
            'https://talksphere-nyay.onrender.com/meetings',
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return response.data;
    }
    catch(err){
        console.log(err)
        return err
    }
  
});

// Edit a meeting
export const editMeeting = createAsyncThunk('meetings/editMeeting', async ({ id, formData }) => {
    try{
        const token = await getFreshToken();
        const response = await axios.put(
            `https://talksphere-nyay.onrender.com/meetings/${id}`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return response.data;
    }
    catch(err){
        console.log(err)
        return err
    }
  
});

// Delete a meeting
export const deleteMeeting = createAsyncThunk('meetings/deleteMeeting', async (id) => {
    try{
        const token = await getFreshToken();
        await axios.delete(`https://talksphere-nyay.onrender.com/meetings/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return id;
    }
    catch(err){
        console.log(err)
        return err
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
      });
  },
});

export default meetingsSlice.reducer;
