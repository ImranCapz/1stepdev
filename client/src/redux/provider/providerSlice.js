import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentProvider: null,
  loading: false,
  error: null,
  isProviderFetched: true,
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
        state.isProviderFetched = true;
        state.currentProvider = action.payload;
      } else {
        state.isProviderFetched = false;
        state.currentProvider = null;
      }
      state.loading = false;
      state.error = false;
    },
    providerOut: (state) => {
      state.currentProvider = null;
      state.isProviderFetched = true;
      state.loading = false;
      state.error = false;
    },
  },
});

export const { selectProvider, providerData, providerOut, selectUser } =
  providerSlice.actions;

export default providerSlice.reducer;
