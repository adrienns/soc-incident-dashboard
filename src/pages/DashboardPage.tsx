import { useEffect } from "react";
import {
    Card,
    CardBody,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Pagination,
} from "@heroui/react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
    fetchIncidents,
    selectIncidentsStatus,
    selectIncidentsError,
    selectConnectionStatus,
    selectLastCriticalIncident,
    selectSummaryCounts,
    clearCriticalAlert,
    selectFilteredIncidents,
    selectFilters,
} from "../features/incidents/incidentsSlice";
import { logout } from "../features/auth/authSlice";
import { websocketManager } from "../services/websocket";
import { useURLSync } from "../hooks/useURLSync";
import { SidebarFilters } from "../features/incidents/SidebarFilters";
import { SummaryCard } from "../components/ui/SummaryCard";
import { IncidentsTable } from "../features/incidents/IncidentsTable";

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectIncidentsStatus);
    const error = useAppSelector(selectIncidentsError);
    const connectionStatus = useAppSelector(selectConnectionStatus);
    const lastCriticalIncident = useAppSelector(selectLastCriticalIncident);
    const summaryCounts = useAppSelector(selectSummaryCounts);
    const token = useAppSelector((state) => state.auth.token);

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Initialize URL sync (watches URL and dispatches to Redux)
    const { updateURL } = useURLSync();

    // Pagination logic
    const filteredIncidents = useAppSelector(selectFilteredIncidents);
    const filters = useAppSelector(selectFilters);
    const totalPages = Math.ceil(filteredIncidents.length / filters.rowsPerPage);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchIncidents());
        }
    }, [status, dispatch]);

    // Initialize WebSocket connection
    useEffect(() => {
        websocketManager.init(dispatch);

        if (token) {
            websocketManager.connect(token);
        }

        return () => {
            websocketManager.disconnect();
        };
    }, [dispatch, token]);

    // Show alert when critical incident arrives
    useEffect(() => {
        if (lastCriticalIncident) {
            onOpen();
        }
    }, [lastCriticalIncident, onOpen]);

    const handleLogout = () => {
        websocketManager.disconnect();
        dispatch(logout());
    };

    const handleCloseAlert = () => {
        dispatch(clearCriticalAlert());
        onClose();
    };



    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return 'REAL-TIME';
            case 'connecting': return 'CONNECTING...';
            default: return 'OFFLINE';
        }
    };

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-background text-foreground">
                <Card className="max-w-md bg-danger-50">
                    <CardBody>
                        <p className="text-danger">Error: {error}</p>
                        <Button className="mt-4" onPress={() => dispatch(fetchIncidents())}>
                            Retry
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }



    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            {/* Top Bar */}
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
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-default-100 border border-default-200">
                        <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-danger'}`}></div>
                        <span className="text-sm font-bold tracking-wider">{getConnectionStatusText()}</span>
                    </div>
                    <Button
                        size="md"
                        color="primary"
                        variant="bordered"
                        onPress={handleLogout}
                        className="font-medium border-primary/50 hover:bg-primary/10 transition-colors"
                    >
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-col p-6 gap-6 h-[calc(100vh-80px)] overflow-hidden">
                {/* Summary Row */}
                <div className="flex flex-wrap gap-4 flex-shrink-0">
                    <SummaryCard title="CRITICAL" count={summaryCounts.CRITICAL} color="danger" />
                    <SummaryCard title="HIGH" count={summaryCounts.HIGH} color="warning" />
                    <SummaryCard title="MEDIUM" count={summaryCounts.MEDIUM} color="primary" />
                    <SummaryCard title="LOW" count={summaryCounts.LOW} color="default" />
                    <SummaryCard title="OPEN" count={summaryCounts.OPEN} color="default" />
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden">
                    {/* Filters Card */}
                    <Card className="w-80 h-full bg-content1 dark:bg-content1 flex-shrink-0">
                        <CardBody className="p-0 overflow-y-auto">
                            <SidebarFilters />
                        </CardBody>
                    </Card>

                    {/* Table Section */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-auto rounded-t-xl bg-content1 shadow-md">
                            <IncidentsTable />
                        </div>
                        <div className="p-3 bg-content1 rounded-b-xl flex justify-center shadow-md">
                            {totalPages > 1 && (
                                <Pagination
                                    total={totalPages}
                                    page={filters.page}
                                    onChange={(page) => updateURL({ page })}
                                    showControls
                                    color="default"
                                    variant="light"
                                    size="sm"
                                    isCompact
                                    classNames={{
                                        cursor: "!rounded-[5px] cursor-pointer",
                                        item: "!rounded-[5px] hover:!rounded-[5px] data-[active=true]:!rounded-[5px] cursor-pointer",
                                        prev: "!rounded-[5px] hover:!rounded-[5px] cursor-pointer",
                                        next: "!rounded-[5px] hover:!rounded-[5px] cursor-pointer"
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Critical Incident Alert Modal */}
            <Modal isOpen={isOpen} onClose={handleCloseAlert} backdrop="blur" size="lg">
                <ModalContent className="bg-danger-50 border border-danger-200 dark:bg-danger-900/20 dark:border-danger/50">
                    <ModalHeader className="flex gap-3 text-danger">
                        <div className="p-2 bg-danger/10 rounded-full">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span>New CRITICAL Incident Detected</span>
                            <span className="text-tiny font-normal text-danger-500">Immediate attention required</span>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {lastCriticalIncident && (
                            <div className="space-y-4 p-4 rounded-lg bg-background/50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs uppercase text-default-500 font-semibold">Category</p>
                                        <p className="font-medium">{lastCriticalIncident.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-default-500 font-semibold">Source</p>
                                        <p className="font-mono text-small">{lastCriticalIncident.source}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs uppercase text-default-500 font-semibold">Time</p>
                                        <p>{new Date(lastCriticalIncident.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" color="danger" onPress={handleCloseAlert}>
                            Dismiss
                        </Button>
                        <Button className="bg-danger text-white shadow-lg shadow-danger/40" onPress={handleCloseAlert}>
                            Acknowledge & Investigate
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </div >
    );
}
