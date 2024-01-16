import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        accessToken: null,
        refreshToken: null,
    },
    reducers:{
        login: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload;
        }
    }
})

export const {login, logout, updateAccessToken } = userSlice.actions;


export const selectUser = (state) => state.user.user;
export const selectAccessToken = (state) => state.user.accessToken;
export const selectRefreshToken = (state) => state.user.refreshToken;

export default userSlice.reducer;