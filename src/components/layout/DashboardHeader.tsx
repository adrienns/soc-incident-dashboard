import { Button } from "@heroui/react";

interface DashboardHeaderProps {
    connectionStatus: 'connected' | 'connecting' | 'disconnected';
    onLogout: () => void;
}

export const DashboardHeader = ({ connectionStatus, onLogout }: DashboardHeaderProps) => {
    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return 'REAL-TIME';
            case 'connecting': return 'CONNECTING...';
            default: return 'OFFLINE';
        }
    };

    return (
        <header className="h-16 border-b border-default-200 flex items-center justify-between px-6 bg-content1 flex-shrink-0 z-20">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-default-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <span className="text-lg font-bold">SOC Incident Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-default-100 border border-default-200">
                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-danger'}`}></div>
                    <span className="text-xs font-bold tracking-wider">{getConnectionStatusText()}</span>
                </div>
                <Button size="sm" color="danger" variant="light" onPress={onLogout}>
                    Logout
                </Button>
            </div>
        </header>
    );
};
