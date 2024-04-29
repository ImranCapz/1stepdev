import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  hasApprovedBooking:false,
  lastSeenBookingId: null,
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
    },
    getBookingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setHasApprovedBooking:(state,action)=>{
      state.hasApprovedBooking = action.payload;
    },
    setLastSeenBookingId:(state,action)=>{
      state.lastSeenBookingId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(approveBooking.fulfilled, (state, action) => {
      state.bookings = state.bookings.map((booking) => {
        if (booking._id === action.payload) {
          if (state.lastSeenBookingId !== action.payload) {
            state.hasApprovedBooking = true;
          }
          state.lastSeenBookingId = action.payload;
          return { ...booking, status: "approved" };
        }
        return booking;
      });
    });
    builder.addCase(rejectBooking.fulfilled, (state, action) => {
      state.bookings = state.bookings.map((booking) => {
        booking._id === action.payload
          ? { ...booking, status: "rejected" }
          : booking;
      });
    });
  },
});

export const { getBookingsStart, getBookingSuccess, getBookingFailure,setHasApprovedBooking,setLastSeenBookingId } =
  bookingSlice.actions;

export default bookingSlice.reducer;
