import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { RootState } from '../../store';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'OPEN' | 'RESOLVED' | 'ESCALATED';

export interface Incident {
    id: string;
    severity: Severity;
    category: string;
    source: string;
    timestamp: string;
    status: Status;
}

// Normalization: { ids: [], entities: {} }
const incidentsAdapter = createEntityAdapter<Incident>({
    sortComparer: (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
});

interface IncidentsState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState = incidentsAdapter.getInitialState<IncidentsState>({
    status: 'idle',
    error: null,
});

export const fetchIncidents = createAsyncThunk('incidents/fetchIncidents', async () => {
    const response = await client.get('/api/incidents');
    return response.data;
});

const incidentsSlice = createSlice({
    name: 'incidents',
    initialState,
    reducers: {},
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
                state.error = action.error.message || 'Failed to fetch incidents';
            });
    },
});

export default incidentsSlice.reducer;

// Selectors
export const {
    selectAll: selectAllIncidents,
    selectById: selectIncidentById,
    selectIds: selectIncidentIds,
} = incidentsAdapter.getSelectors<RootState>((state) => state.incidents);

export const selectIncidentsStatus = (state: RootState) => state.incidents.status;
export const selectIncidentsError = (state: RootState) => state.incidents.error;
