import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState, // Corrected variable name
  reducers: {
    setUserDetails: (state, action) => {
      return { ...action.payload }; // Correct state assignment
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
