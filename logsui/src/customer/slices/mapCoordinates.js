import { createSlice } from "@reduxjs/toolkit";

export const mapCoordinates = createSlice({
  name: "mapCoordinates",
  initialState: {
    pickupCoordinatesState: null,
    dropoffCoordinatesState: null,

    pickupLocation: null,
    dropoffLocation: null,
  },
  reducers: {
    setPickupCoordinatesState: (state, action) => {
      state.pickupCoordinatesState = action.payload;
    },
    setDropoffCoordinatesState: (state, action) => {
      state.dropoffCoordinatesState = action.payload;
    },

    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload;
    },

    setDropoffLocation: (state, action) => {
      state.dropoffLocation = action.payload;
    },
    resetMapCoordinates: (state) => {
      state.pickupCoordinatesState = null;
      state.dropoffCoordinatesState = null;
      state.pickupLocation = null;
      state.dropoffLocation = null;
    },
  },
});

export const {
  setPickupCoordinatesState,
  setDropoffCoordinatesState,
  setPickupLocation,
  setDropoffLocation,
  resetMapCoordinates,
} = mapCoordinates.actions;

export default mapCoordinates.reducer;
