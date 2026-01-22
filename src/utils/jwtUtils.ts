/**
 * JWT Utility Functions
 * Provides token decoding, validation, and expiration checking
 */

interface JWTPayload {
    exp?: number; // Expiration time (Unix timestamp)
    iat?: number; // Issued at time
    username?: string;
    role?: string;
    [key: string]: any;
}

/**
 * Decode JWT token payload (without verification)
 * Note: This only decodes, does not verify signature
 */
export const decodeToken = (token: string): JWTPayload | null => {
    try {
        // JWT format: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid JWT format');
            return null;
        }

        const payload = parts[1];
        // Decode base64url (replace chars and decode)
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if expired, false if valid
 */
export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;

    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
        // If we can't decode or no expiration, consider it invalid
        return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

/**
 * Get time until token expiration in milliseconds
 * @param token - JWT token string
 * @returns milliseconds until expiration, or 0 if expired/invalid
 */
export const getTokenExpirationTime = (token: string | null): number => {
    if (!token) return 0;

    const payload = decodeToken(token);
    if (!payload || !payload.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;

    return timeUntilExpiry > 0 ? timeUntilExpiry * 1000 : 0; // Convert to milliseconds
};

/**
 * Check if token will expire soon (within threshold)
 * @param token - JWT token string
 * @param thresholdSeconds - Time threshold in seconds (default: 5 minutes)
 * @returns true if token expires within threshold
 */
export const isTokenExpiringSoon = (token: string | null, thresholdSeconds: number = 300): boolean => {
    if (!token) return true;

    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;

    return timeUntilExpiry <= thresholdSeconds && timeUntilExpiry > 0;
};

/**
 * Get token payload data
 * @param token - JWT token string
 * @returns decoded payload or null
 */
export const getTokenPayload = (token: string | null): JWTPayload | null => {
    if (!token) return null;
    return decodeToken(token);
};
