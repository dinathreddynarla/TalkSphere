import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser , updateUser } from "../services/userService";
import { logout} from "../services/authService"
import Cookies from "js-cookie";


// Fetch user profile async action
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const cookie = Cookies.get("session");
      const session = cookie ? JSON.parse(cookie) : null;
      if (!session || !session.token) {
        return rejectWithValue("No session found");
      }
      const response = await getUser(session.token);
      //console.log(response);
      
      return response;
    } catch (error) {
        return rejectWithValue(
            error.response?.status === 404
              ? "User not found. You are currently browsing as a guest."
              : "Failed to fetch user profile."
          );
    }
  }
);

// Thunk to Update User Profile
export const updateUserProfile = createAsyncThunk(
    "user/updateUserProfile",
    async (data, { rejectWithValue }) => {
      try {
        const cookie = Cookies.get("session");
        const session = cookie ? JSON.parse(cookie) : null;
        if (!session || !session.token) {
          return rejectWithValue("No session found");
        }
        const response = await updateUser(session.token,data);
        //console.log(response);
        
        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.status === 404
            ? "User not found. Please check your details."
            : "Failed to update profile."
        );
      }
    }
  );

// Logout user async action
export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await logout();
    Cookies.remove("session");
    Navigate("/")
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// User Slice
const userSlice = createSlice({
    name: "user",
    initialState :{
        user: null,
        status: "idle", // idle | loading | succeeded | failed
        error: null,
      },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch User Profile
        .addCase(fetchUserProfile.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.user = action.payload;
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
        // Update User Profile
        .addCase(updateUserProfile.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.user = { ...state.user, ...action.payload };
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        });
    },
  });
  
  export default userSlice.reducer;
  