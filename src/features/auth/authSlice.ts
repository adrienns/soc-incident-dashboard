import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { isTokenExpired } from '../../utils/jwtUtils';

interface User {
    username: string;
    // add other user properties if the API returns them
}

interface LoginAttempt {
    timestamp: number;
    failed: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    loginAttempts: LoginAttempt[];
    rateLimitUntil: number | null; // Unix timestamp
}

// Validate token on initialization - don't use expired tokens
const storedToken = localStorage.getItem('token');
const isValidToken = !!(storedToken && !isTokenExpired(storedToken));

// Clear expired token from storage
if (storedToken && !isValidToken) {
    localStorage.removeItem('token');
}

const initialState: AuthState = {
    user: null,
    token: isValidToken ? storedToken : null,
    isAuthenticated: isValidToken,
    status: 'idle',
    error: null,
    loginAttempts: [],
    rateLimitUntil: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue, getState }) => {
        const state = getState() as { auth: AuthState };

        // Check rate limiting
        if (state.auth.rateLimitUntil && Date.now() < state.auth.rateLimitUntil) {
            const waitTime = Math.ceil((state.auth.rateLimitUntil - Date.now()) / 1000);
            return rejectWithValue({
                message: `Too many login attempts. Please try again in ${waitTime} seconds.`
            });
        }

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
            state.loginAttempts = [];
            state.rateLimitUntil = null;

            // Enhanced cleanup - remove all auth-related data
            localStorage.removeItem('token');
            sessionStorage.clear(); // Clear any session data
        },
        tokenReceived: (state, action: PayloadAction<string>) => {
            // Validate token before accepting it
            if (!isTokenExpired(action.payload)) {
                state.token = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload);
            } else {
                console.warn('Attempted to set expired token');
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
            }
        },
        clearRateLimit: (state) => {
            state.rateLimitUntil = null;
            state.loginAttempts = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;

                // Clean up old attempts (older than 15 minutes)
                const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
                state.loginAttempts = state.loginAttempts.filter(
                    attempt => attempt.timestamp > fifteenMinutesAgo
                );
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'succeeded';
                console.log('Login successful, payload:', action.payload);

                // Try to find the token in various common properties
                const token = action.payload.access_token ||
                    action.payload.token ||
                    action.payload.jwt ||
                    action.payload.data?.token ||
                    action.payload.accessToken;

                if (token && !isTokenExpired(token)) {
                    state.token = token;
                    state.isAuthenticated = true;
                    localStorage.setItem('token', token);

                    // Clear rate limiting on successful login
                    state.loginAttempts = [];
                    state.rateLimitUntil = null;
                } else if (token && isTokenExpired(token)) {
                    console.error('Received expired token from server');
                    state.status = 'failed';
                    state.error = 'Received expired authentication token';
                    state.isAuthenticated = false;
                } else {
                    console.error('Token not found in login response:', action.payload);
                    state.status = 'failed';
                    state.error = 'Invalid response from server (missing token)';
                    state.isAuthenticated = false;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as any)?.message || 'Login failed';

                // Track failed login attempt
                state.loginAttempts.push({
                    timestamp: Date.now(),
                    failed: true,
                });

                // Rate limiting: 5 failed attempts in 15 minutes = 15 minute lockout
                const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
                const recentFailedAttempts = state.loginAttempts.filter(
                    attempt => attempt.failed && attempt.timestamp > fifteenMinutesAgo
                );

                if (recentFailedAttempts.length >= 5) {
                    state.rateLimitUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
                    state.error = 'Too many failed login attempts. Account temporarily locked for 15 minutes.';
                }
            });
    },
});

export const { logout, tokenReceived, clearRateLimit } = authSlice.actions;
export default authSlice.reducer;
