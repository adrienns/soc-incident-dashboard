import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { RootState } from '../../store';

import {
    type Severity,
    type Status,
    type ConnectionStatus,
    SEVERITY_ORDER
} from '../../constants/incidents';

export interface Incident {
    id: string;
    severity: Severity;
    category: string;
    source: string;
    timestamp: string;
    status: Status;
}

export interface FilterState {
    severities: Severity[];
    status: Status | null;
    category: string | null;
    search: string;
    sortBy: 'timestamp' | 'severity';
    sortOrder: 'asc' | 'desc';
    page: number;
    rowsPerPage: number;
}

const initialFilters: FilterState = {
    severities: [],
    status: null,
    category: null,
    search: '',
    sortBy: 'timestamp',
    sortOrder: 'desc',
    page: 1,
    rowsPerPage: 10,
};

// Normalization: { ids: [], entities: {} }
const incidentsAdapter = createEntityAdapter<Incident>({
    sortComparer: (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
});

interface IncidentsState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    connectionStatus: ConnectionStatus;
    lastCriticalIncident: Incident | null;
    filters: FilterState;
}

const initialState = incidentsAdapter.getInitialState<IncidentsState>({
    status: 'idle',
    error: null,
    connectionStatus: 'disconnected',
    lastCriticalIncident: null,
    filters: initialFilters,
});

export const fetchIncidents = createAsyncThunk(
    'incidents/fetchIncidents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get('/api/incidents');
            // API returns { incidents: [...], total: N }
            return response.data.incidents;
        } catch (err: any) {
            if (!err.response) {
                // Network error
                return rejectWithValue('Network error. Please check your connection.');
            }
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch incidents');
        }
    }
);

// Optimistic update thunk for patching incident status
export const patchIncidentStatus = createAsyncThunk(
    'incidents/patchStatus',
    async (
        { id, status }: { id: string; status: Status },
        { dispatch, getState, rejectWithValue }
    ) => {
        // Get old status for rollback
        const state = getState() as { incidents: ReturnType<typeof incidentsAdapter.getInitialState> & { entities: Record<string, Incident> } };
        const oldIncident = state.incidents.entities[id];
        const oldStatus = oldIncident?.status;

        // Optimistic update
        dispatch(updateIncidentStatusLocal({ id, status }));

        try {
            const response = await client.patch(`/api/incidents/${id}`, { status });
            return response.data;
        } catch (err: any) {
            // Rollback on failure
            if (oldStatus) {
                dispatch(updateIncidentStatusLocal({ id, status: oldStatus }));
            }
            return rejectWithValue(err.response?.data?.message || 'Failed to update incident');
        }
    }
);

const incidentsSlice = createSlice({
    name: 'incidents',
    initialState,
    reducers: {
        incidentReceived: (state, action: PayloadAction<Incident>) => {
            const incident = action.payload;
            incidentsAdapter.upsertOne(state, incident);

            // Track critical incidents for alerts
            if (incident.severity === 'CRITICAL' && incident.status === 'OPEN') {
                state.lastCriticalIncident = incident;
            }
        },
        setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
            state.connectionStatus = action.payload;
        },
        clearCriticalAlert: (state) => {
            state.lastCriticalIncident = null;
        },
        setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialFilters;
        },
        // Internal action for optimistic updates (used by patchIncidentStatus thunk)
        updateIncidentStatusLocal: (state, action: PayloadAction<{ id: string; status: Status }>) => {
            const { id, status } = action.payload;
            incidentsAdapter.updateOne(state, { id, changes: { status } });

            // If checking a resolved/escalated incident, we might need to clear critical alert
            if (state.lastCriticalIncident && state.lastCriticalIncident.id === id && status !== 'OPEN') {
                state.lastCriticalIncident = null;
            }
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        setRowsPerPage: (state, action: PayloadAction<number>) => {
            state.filters.rowsPerPage = action.payload;
            state.filters.page = 1; // Reset to page 1 when changing rows per page
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIncidents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchIncidents.fulfilled, (state, action: PayloadAction<Incident[]>) => {
                state.status = 'succeeded';
                // Use `setAll` to replace all existing incidents with the fetched list
                incidentsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchIncidents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) || action.error.message || 'Failed to fetch incidents';
            });
    },
});

export const { incidentReceived, setConnectionStatus, clearCriticalAlert, setFilters, clearFilters, updateIncidentStatusLocal, setPage, setRowsPerPage } = incidentsSlice.actions;
export default incidentsSlice.reducer;

// Base selectors
export const {
    selectAll: selectAllIncidents,
    selectById: selectIncidentById,
    selectIds: selectIncidentIds,
} = incidentsAdapter.getSelectors<RootState>((state) => state.incidents);

export const selectIncidentsStatus = (state: RootState) => state.incidents.status;
export const selectIncidentsError = (state: RootState) => state.incidents.error;
export const selectConnectionStatus = (state: RootState) => state.incidents.connectionStatus;
export const selectLastCriticalIncident = (state: RootState) => state.incidents.lastCriticalIncident;
export const selectFilters = (state: RootState) => state.incidents.filters;

// Severity order for sorting is imported from constants

// Memoized selector for filtered incidents
export const selectFilteredIncidents = createSelector(
    [selectAllIncidents, selectFilters],
    (incidents, filters) => {
        let result = [...incidents];

        // Filter by severities (multi-select)
        if (filters.severities.length > 0) {
            result = result.filter((inc) => filters.severities.includes(inc.severity));
        }

        // Filter by status
        if (filters.status) {
            result = result.filter((inc) => inc.status === filters.status);
        }

        // Filter by category
        if (filters.category) {
            result = result.filter((inc) => inc.category === filters.category);
        }

        // Filter by search (source IP)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter((inc) => inc.source.toLowerCase().includes(searchLower));
        }

        // Sort
        result.sort((a, b) => {
            if (filters.sortBy === 'severity') {
                const diff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
                return filters.sortOrder === 'asc' ? diff : -diff;
            } else {
                const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                return filters.sortOrder === 'asc' ? diff : -diff;
            }
        });

        return result;
    }
);

// Memoized selector for paginated incidents
export const selectPaginatedIncidents = createSelector(
    [selectFilteredIncidents, selectFilters],
    (filteredIncidents, filters) => {
        const { page, rowsPerPage } = filters;
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredIncidents.slice(start, end);
    }
);

// Summary counts selector
export const selectSummaryCounts = createSelector(
    [selectAllIncidents],
    (incidents) => {
        const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, OPEN: 0, total: 0 };
        incidents.forEach((inc) => {
            counts[inc.severity]++;
            if (inc.status === 'OPEN') counts.OPEN++;
            counts.total++;
        });
        return counts;
    }
);
