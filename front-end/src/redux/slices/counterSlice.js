import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find(i => i._id === item._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item._id !== id);
    },
    updateCartItemQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find(i => i._id === _id);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity } = counterSlice.actions;
export default counterSlice.reducer;
