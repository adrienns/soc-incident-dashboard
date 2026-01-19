import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../api/client';

interface User {
    username: string;
    // add other user properties if the API returns them
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    status: 'idle',
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await client.post('/api/auth/login', credentials);
            // Assuming response.data contains { token: string } or similar. 
            // Documentation says "Returns an access token".
            return response.data;
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('token');
        },
        tokenReceived: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ access_token: string }>) => {
                state.status = 'succeeded';
                // The API likely returns { access_token: "..." } or { token: "..." }
                // Based on common patterns I'll assume access_token or check the response later. 
                // For now let's type it loosely or assume 'access_token' based on standard JWT flows.
                // Actually, let's just save the token.
                // The prompt says "Returns an access token."
                const token = action.payload.access_token || (action.payload as any).token;
                state.token = token;
                state.isAuthenticated = true;
                localStorage.setItem('token', token);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as any)?.message || 'Login failed';
            });
    },
});

export const { logout, tokenReceived } = authSlice.actions;
export default authSlice.reducer;
