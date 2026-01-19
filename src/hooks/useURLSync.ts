import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { setFilters, type FilterState } from '../features/incidents/incidentsSlice';
import type { Severity, Status } from '../constants/incidents';

/**
 * Hook that syncs URL search params to Redux filter state.
 * URL is the source of truth - changes to URL update Redux.
 */
export function useURLSync() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useAppDispatch();

    // Sync URL params to Redux on mount and URL changes
    useEffect(() => {
        const filters: Partial<FilterState> = {};

        const severityParam = searchParams.get('severity');
        if (severityParam) {
            filters.severities = severityParam.split(',').filter(Boolean) as Severity[];
        } else {
            filters.severities = [];
        }

        const statusParam = searchParams.get('status');
        filters.status = (statusParam as Status) || null;

        const categoryParam = searchParams.get('category');
        filters.category = categoryParam || null;

        const searchParam = searchParams.get('search');
        filters.search = searchParam || '';

        const sortByParam = searchParams.get('sortBy');
        if (sortByParam === 'severity' || sortByParam === 'timestamp') {
            filters.sortBy = sortByParam;
        }

        const sortOrderParam = searchParams.get('sortOrder');
        if (sortOrderParam === 'asc' || sortOrderParam === 'desc') {
            filters.sortOrder = sortOrderParam;
        }

        dispatch(setFilters(filters));
    }, [searchParams, dispatch]);

    // Helper to update URL (which triggers the sync above)
    const updateURL = useCallback((updates: Record<string, string | null>) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === '') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, value);
                }
            });

            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    // Clear all filters from URL
    const clearURL = useCallback(() => {
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    return { searchParams, updateURL, clearURL };
}
