import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  providerBooking: [],
  loading: false,
  error: null,
  hasApprovedBooking: false,
  lastSeenBookingId: null,
  isUserBookingFetched: false,
  isProviderBookingFetched: false,
};

export const approveBooking = createAsyncThunk(
  "booking/approveBooking",
  async (bookingId) => {
    const res = await fetch(`/server/booking/approve/${bookingId}`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      return bookingId;
    } else {
      throw new Error("Failed to approve booking");
    }
  }
);

export const rejectBooking = createAsyncThunk(
  "booking/rejectBooking",
  async (bookingId) => {
    const res = await fetch(`/server/booking/reject/${bookingId}`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      return bookingId;
    } else {
      throw new Error("Failed to reject booking");
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    getBookingsStart: (state) => {
      state.loading = true;
    },
    getBookingSuccess: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
      state.error = null;
      state.isUserBookingFetched = true;
    },
    getBookingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isUserBookingFetched = true;
    },
    getProviderBookingStart: (state) => {
      state.loading = true;
    },
    getProviderBookingSuccess: (state, action) => {
      state.providerBooking = action.payload;
      state.loading = false;
      state.error = null;
      state.isProviderBookingFetched = true;
    },
    getProviderBookingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isProviderBookingFetched = true;
    },
    setHasApprovedBooking: (state, action) => {
      state.hasApprovedBooking = action.payload;
    },
    setLastSeenBookingId: (state, action) => {
      state.lastSeenBookingId = action.payload;
    },
    bookingOut: (state) => {
      state.bookings = null;
      state.providerBooking = null;
      state.loading = false;
      state.error = null;
      state.isUserBookingFetched = false;
      state.isProviderBookingFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(approveBooking.fulfilled, (state, action) => {
      state.providerBooking = state.providerBooking.map((booking) => {
        if (booking._id === action.payload) {
          return { ...booking, status: "approved" };
        }
        return booking;
      });
    });
    builder.addCase(rejectBooking.fulfilled, (state, action) => {
      state.providerBooking = state.providerBooking.map((booking) => {
        if (booking._id === action.payload) {
          return { ...booking, status: "rejected" };
        }
        return booking;
      });
    });
  },
});

export const {
  getBookingsStart,
  getBookingSuccess,
  getBookingFailure,
  getProviderBookingStart,
  getProviderBookingSuccess,
  getProviderBookingFailure,
  bookingOut,
  setHasApprovedBooking,
  setLastSeenBookingId,
} = bookingSlice.actions;

export default bookingSlice.reducer;
