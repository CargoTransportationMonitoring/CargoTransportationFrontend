import {createSlice, Slice} from "@reduxjs/toolkit";

export interface AuthType {
    isAuthenticated: boolean;
    role: string | null;
    token: string | null;
}

const initialState: AuthType = {
    isAuthenticated: false,
    role: null,
    token: null,
}

const authSlice: Slice<AuthType> = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state: AuthType, action): void => {
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.token = action.payload.token;
        },
        logout: (): AuthType => {
            return initialState;
        }
    }
})

export const {login, logout} = authSlice.actions
export const selectIsAuthenticated = (state: { auth: AuthType }): boolean => state.auth.isAuthenticated
export default authSlice.reducer