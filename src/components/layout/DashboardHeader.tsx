import { Button } from "@heroui/react";
import type { ConnectionStatus } from "../../constants/incidents";
import { ConnectionStatusBadge } from "../ui/ConnectionStatusBadge";

interface DashboardHeaderProps {
    connectionStatus: ConnectionStatus;
    onLogout: () => void;
}

export const DashboardHeader = ({ connectionStatus, onLogout }: DashboardHeaderProps) => {
    return (
        <header className="h-20 flex items-center justify-between px-8 bg-content1 flex-shrink-0 z-20">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <span className="text-xl font-bold">SOC Incident Dashboard</span>
            </div>
            <div className="flex items-center gap-5">
                <ConnectionStatusBadge status={connectionStatus} />
                <Button
                    size="md"
                    color="primary"
                    variant="bordered"
                    onPress={onLogout}
                    className="font-medium border-primary/50 hover:bg-primary/10 transition-colors"
                >
                    Logout
                </Button>
            </div>
        </header>
    );
};
