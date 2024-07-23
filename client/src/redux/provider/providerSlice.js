import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentProvider: null,
  loading: false,
  error: null,
};

export const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    selectProvider: (state, action) => {
      state.id = action.payload;
    },
    selectUser: (state, action) => {
      state.user = action.payload;
    },
    providerData: (state, action) => {
      if (action.payload) {
        state.currentProvider = action.payload;
      } else {
        state.currentProvider = null;
      }
      state.loading = false;
      state.error = false;
    },
    providerOut: (state) => {
      state.currentProvider = null;
      state.loading = false;
      state.error = false;
    },
  },
});

export const { selectProvider, providerData, providerOut, selectUser } =
  providerSlice.actions;

export default providerSlice.reducer;
