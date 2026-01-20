import { useState, useEffect } from 'react';

/**
 * Custom hook to track media query matches
 * @param query - Media query string (e.g., '(min-width: 1425px)')
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        const media = window.matchMedia(query);
        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

        media.addEventListener('change', handler);

        return () => media.removeEventListener('change', handler);
    }, [query]);

    return matches;
};
