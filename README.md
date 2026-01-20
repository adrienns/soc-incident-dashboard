# SOC Incident Dashboard

Real-time Security Operations Center dashboard for monitoring and managing security incidents. Built with React, Redux Toolkit, and WebSocket integration.

## Features

- **Real-Time Updates**: Live incident updates via WebSocket with automatic reconnection
- **Advanced Filtering**: Multi-criteria filtering with URL-synchronized state
- **Responsive Design**: Mobile-optimized with adaptive layouts
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Critical Alerts**: Modal notifications for critical severity incidents

## Tech Stack

- React 18 + TypeScript
- Redux Toolkit (normalized state with EntityAdapter)
- HeroUI + Tailwind CSS
- Socket.IO Client
- Axios with token refresh
- Vite

## Getting Started

```bash
npm install
npm run dev
```

Default credentials: `analyst` / `s3cur3`

## Redux Store Design

### State Structure

The store is split into two slices: `auth` and `incidents`. The auth slice handles login/logout and token management, storing the JWT in localStorage so users stay logged in across refreshes. The incidents slice is where things get more interesting.

For incidents, Redux Toolkit's `createEntityAdapter` is used to normalize the data. Instead of storing incidents as an array, they're stored as `{ ids: [], entities: {} }`. This makes it super fast to look up or update a specific incident by ID - no need to loop through arrays. When a WebSocket update comes in for one incident, just that one gets updated without touching the others.

### Why These Choices?

**Memoized selectors**: `createSelector` is used for all filtering and sorting. This means if you change the search filter, only the search logic runs - not the severity filter, not the sorting, nothing else. It only recalculates what actually changed. This keeps the UI snappy even with lots of incidents.

**Optimistic updates**: When you click "Resolve" on an incident, the UI updates immediately. Behind the scenes, the API call happens, and if it fails, the change gets rolled back. Users don't have to wait for the server to respond to see their action reflected.

**Filters in Redux + URL**: Filter state is kept in Redux but synced with URL query params. This means you can share a filtered view by just copying the URL. A custom `useURLSync` hook watches for URL changes and updates Redux, and vice versa. The URL is the source of truth.

**WebSocket separation**: The WebSocket manager lives outside Redux as a service. When new incidents arrive, it just dispatches an `incidentReceived` action. This keeps Redux pure and makes it easier to handle connection/reconnection logic separately.

## Architecture Highlights

- **State Management**: Redux Toolkit with memoized selectors and normalized state
- **Real-Time**: WebSocket connection with resilient reconnection strategy
- **Authentication**: JWT with automatic token refresh and request queuing
- **Performance**: Client-side filtering, pagination, and optimistic updates
- **Error Handling**: Comprehensive error boundaries and fallback states

## Project Structure

```
src/
├── features/          # Feature-based modules (auth, incidents)
├── components/        # Reusable UI components
├── hooks/            # Custom hooks (useURLSync, useMediaQuery)
├── services/         # WebSocket manager
└── api/              # HTTP client with interceptors
```

## API Integration

- `POST /api/auth/login` - Authentication
- `GET /api/incidents` - Fetch incidents
- `PATCH /api/incidents/:id` - Update incident status
- WebSocket events: `incident_update`, `incident`, `new_incident`
