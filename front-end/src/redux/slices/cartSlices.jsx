// cartslices.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { item, quantity, size, color } = action.payload;
            const existingItem = state.items.find((cartItem) =>
                cartItem._id === item._id && 
                cartItem.size === size && 
                cartItem.color === color
            );

            if (existingItem) {
                existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
            } else {
                state.items.push({ ...item, quantity, size, color });
            }
        },
        removeFromCart: (state, action) => {
            const { _id, size, color } = action.payload;
            state.items = state.items.filter((item) =>
                item._id !== _id || item.size !== size || item.color !== color
            );
        },
        updateCartItemQuantity: (state, action) => {
            const { _id, size, color, quantity } = action.payload;
            const item = state.items.find((item) =>
                item._id === _id && item.size === size && item.color === color
            );

            if (item) {
                item.quantity = quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;  // Note: Use .reducer here, not .actions
