import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  message: null,
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    signUpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signUpStart, signUpSuccess, signUpFailure } = userSlice.actions;

export default userSlice.reducer;
