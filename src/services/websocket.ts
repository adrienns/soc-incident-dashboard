import { io, Socket } from 'socket.io-client';
import type { AppDispatch } from '../store';
import { incidentReceived, setConnectionStatus } from '../features/incidents/incidentsSlice';
import type { Incident } from '../features/incidents/incidentsSlice';

const SOCKET_URL = 'https://incident-platform.azurewebsites.net';

class WebSocketManager {
    private socket: Socket | null = null;
    private dispatch: AppDispatch | null = null;

    init(dispatch: AppDispatch) {
        this.dispatch = dispatch;
    }

    connect(token: string) {
        if (!this.dispatch) {
            console.error('WebSocketManager: dispatch not initialized');
            return;
        }

        this.dispatch(setConnectionStatus('connecting'));

        // Disconnect existing socket if any
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 16000,
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.socket || !this.dispatch) return;

        this.socket.on('connect', () => {
            console.log('Socket.IO connected');
            this.dispatch!(setConnectionStatus('connected'));
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket.IO disconnected:', reason);
            this.dispatch!(setConnectionStatus('disconnected'));
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error.message);
            this.dispatch!(setConnectionStatus('disconnected'));
        });

        // Listen for incident updates
        this.socket.on('incident_update', (incident: Incident) => {
            console.log('Received incident update:', incident);
            this.dispatch!(incidentReceived(incident));
        });

        // Some backends use different event names
        this.socket.on('incident', (incident: Incident) => {
            console.log('Received incident:', incident);
            this.dispatch!(incidentReceived(incident));
        });

        this.socket.on('new_incident', (incident: Incident) => {
            console.log('Received new incident:', incident);
            this.dispatch!(incidentReceived(incident));
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

// Singleton instance
export const websocketManager = new WebSocketManager();
