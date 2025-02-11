import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import meetingReducer from "./meetingsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    meetings: meetingReducer,
  },
});

export default store;
