import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/authSlice";
import cartReducer from "../redux/features/cartSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
