import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNavbarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openNavbar: (state) => {
      state.isNavbarOpen = true;
    },
    closeNavbar: (state) => {
      state.isNavbarOpen = false;
    },
    toggleNavbar: (state) => {
      state.isNavbarOpen = !state.isNavbarOpen;
    },
  },
});

export const { openNavbar, closeNavbar, toggleNavbar } = uiSlice.actions;
export default uiSlice.reducer;