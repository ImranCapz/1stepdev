import { createSlice } from "@reduxjs/toolkit";

const initialState={
  currentProvider:null,
  loading:false,
  error:null,
}

export const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    selectProvider: (state, action) => {
      state.id = action.payload;
    },
    providerData:(state,action)=>{
      state.currentProvider = action.payload;
      state.loading=false;
      state.error=false;
    }
  },
});

export const { selectProvider} = providerSlice.actions;

export default providerSlice.reducer;