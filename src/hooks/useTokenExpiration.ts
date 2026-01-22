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

        // Set timer to logout when token expires
        const timeoutId = setTimeout(() => {
            console.warn('Token expired, auto-logout triggered');
            dispatch(logout());
        }, expirationTime);

        // Cleanup timer on unmount or when token changes
        return () => {
            clearTimeout(timeoutId);
        };
    }, [token, isAuthenticated, dispatch]);
};
