import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        error: null,
    },
    reducers: {
        registerSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        
        },
        registerFailure: (state, action) => {
            state.error = action.payload;
        },
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            localStorage.setItem('token', action.payload.token);
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
});

export const { registerSuccess, registerFailure, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
