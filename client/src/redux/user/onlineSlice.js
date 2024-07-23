import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineAllUsers: {},
};

const onlineSlice = createSlice({
  name: "online",
  initialState,
  reducers: {
    userOnline: (state, action) => {
      state.onlineAllUsers[action.payload] = true;
    },
    userOfflines: (state, action) => {
      delete state.onlineAllUsers[action.payload];
    },
    onlineStatusRemove: (state) => {
      state.onlineAllUsers = {};
    },
  },
});

export const { userOnline, userOfflines, onlineStatusRemove } = onlineSlice.actions;

export default onlineSlice.reducer;
