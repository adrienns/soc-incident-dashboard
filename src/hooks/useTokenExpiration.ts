import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../features/auth/authSlice';
import { getTokenExpirationTime } from '../utils/jwtUtils';

/**
 * Token Expiration Monitor Hook
 * Monitors token expiration and automatically logs out user when token expires
 */
export const useTokenExpiration = () => {
    const token = useAppSelector((state) => state.auth.token);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!token || !isAuthenticated) {
            return;
        }

        const expirationTime = getTokenExpirationTime(token);

        if (expirationTime <= 0) {
            // Token is already expired, logout immediately
            console.warn('Token already expired, logging out');
            dispatch(logout());
            return;
        }

        // Monitor for expiration but let client.ts logic handle the actual refresh/logout cycle
        if (expirationTime <= 0) {
            console.warn('Token technically expired. Next API call will trigger refresh.');
        }
    }, [token, isAuthenticated, dispatch]);
};
