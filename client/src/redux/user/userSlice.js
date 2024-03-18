import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.loading = true;
    },

    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    signinFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },



    updateUserStart:(state) =>{
      state.loading = true;
    },
    updateUserSuccess:(state, action) =>{
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateUserFailure:(state, action) =>{
      state.loading = false;
      state.error = action.payload;
    },


    signOut:(state)=>{
      state.currentUser = null,
      state.loading = false;
      state.error = false;
    },
  },
});

export const { signinStart, signinSuccess, signinFailure, updateUserStart,updateUserSuccess,updateUserFailure, forgetStart,forgetSuccess,forgetFailure,signOut} = userSlice.actions;

export default userSlice.reducer;
