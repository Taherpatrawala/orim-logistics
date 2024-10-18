import { configureStore } from "@reduxjs/toolkit";
import mapCoordinates from "../customer/slices/mapCoordinates";

export const store = configureStore({
  reducer: { mapCoordinates },
});
