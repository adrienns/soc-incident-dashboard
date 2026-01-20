import type { ConnectionStatus } from "../../constants/incidents";

interface ConnectionStatusBadgeProps {
    status: ConnectionStatus;
}

const getConnectionStatusText = (status: ConnectionStatus): string => {
    switch (status) {
        case 'connected':
            return 'REAL-TIME';
        case 'connecting':
            return 'CONNECTING...';
        default:
            return 'OFFLINE';
    }
};

export const ConnectionStatusBadge = ({ status }: ConnectionStatusBadgeProps) => {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-default-100 border border-default-200">
            <div className={`w-2.5 h-2.5 rounded-full ${status === 'connected' ? 'bg-success animate-pulse' : 'bg-danger'}`} />
            <span className="text-sm font-bold tracking-wider">{getConnectionStatusText(status)}</span>
        </div>
    );
};
