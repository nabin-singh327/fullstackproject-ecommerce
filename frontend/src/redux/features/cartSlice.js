import { createSlice } from "@reduxjs/toolkit";

import { useEffect } from "react";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cart")) || [],
  },
  reducers: {
    addItem: (state, action) => {
    const existingItem = state.items.find((item) => item._id === action.payload._id);

        if (existingItem) {
          (existingItem.quantity += 1);
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
          localStorage.setItem("cart", JSON.stringify(state.items));
        }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === _id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    }
  },
});

export const { addItem, removeItem, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
