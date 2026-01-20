import { useRef, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Pagination,
    useDisclosure,
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
    setFilters
} from "../features/incidents/incidentsSlice";
import { logout } from "../features/auth/authSlice";
import { websocketManager } from "../services/websocket";
import { useURLSync } from "../hooks/useURLSync";
import { IncidentFilters } from "../features/incidents/IncidentFilters";
import { SummaryCard } from "../components/ui/SummaryCard";
import { IncidentsTable } from "../features/incidents/IncidentsTable";
import { MobileIncidentsView } from "../features/incidents/MobileIncidentsView";
import { DashboardHeader } from "../components/layout/DashboardHeader";
import { getSeverityColor, getStatusColor } from "../utils/severity";
import { CriticalIncidentModal } from "../components/feedback/CriticalIncidentModal";
import { ErrorState } from "../components/feedback/ErrorState";

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

    // Responsive Logic
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [paginationPadding, setPaginationPadding] = useState(12);

    useEffect(() => {
        const updateLayout = () => {
            if (tableContainerRef.current) {
                const height = tableContainerRef.current.clientHeight;

                // If table is hidden (mobile) or too small, skip calculation or enforce mobile default
                if (height < 100) {
                    return;
                }

                const headerHeight = 60; // Matches IncidentsTable styling
                const rowHeight = 40;   // Matches IncidentsTable styling

                const availableForRows = Math.max(0, height - headerHeight);
                const rows = Math.floor(availableForRows / rowHeight);
                const remainder = availableForRows % rowHeight;

                // Ensure at least 1 row, max 50
                const newRows = Math.max(1, Math.min(50, rows));

                if (newRows !== filters.rowsPerPage) {
                    dispatch(setFilters({ rowsPerPage: newRows }));
                }

                // Apply remainder to pagination padding (base 12px + remainder)
                setPaginationPadding(12 + remainder);
            }
        };

        // Run initially and on resize
        updateLayout();
        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updateLayout);
        });

        if (tableContainerRef.current) observer.observe(tableContainerRef.current);
        return () => observer.disconnect();
    }, [dispatch, filters.rowsPerPage]);

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


    const handleRetry = () => {
        // If it's an auth error, logout and redirect to login
        if (error && (error.includes('token') || error.includes('login') || error.includes('invalidated'))) {
            dispatch(logout());
        } else {
            // Otherwise, retry fetching incidents
            dispatch(fetchIncidents());
        }
    };

    if (error) {
        return <ErrorState message={error} onRetry={handleRetry} />;
    }



    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            {/* Top Bar */}
            <DashboardHeader
                connectionStatus={connectionStatus}
                onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex flex-col p-2 md:p-6 gap-4 md:gap-6 h-[calc(100vh-80px)] overflow-hidden">
                {/* Summary Row */}
                <div className="flex flex-nowrap md:flex-wrap gap-4 flex-shrink-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <SummaryCard title="CRITICAL" count={summaryCounts.CRITICAL} color={getSeverityColor('CRITICAL')} />
                    <SummaryCard title="HIGH" count={summaryCounts.HIGH} color={getSeverityColor('HIGH')} />
                    <SummaryCard title="MEDIUM" count={summaryCounts.MEDIUM} color={getSeverityColor('MEDIUM')} />
                    <SummaryCard title="LOW" count={summaryCounts.LOW} color={getSeverityColor('LOW')} />
                    <SummaryCard title="OPEN" count={summaryCounts.OPEN} color={getStatusColor('OPEN')} />
                </div>

                <div className="flex flex-col min-[1425px]:flex-row flex-1 gap-4 md:gap-6 overflow-hidden">
                    {/* Filters Card */}
                    <Card className="w-full h-auto max-h-[35vh] min-[1425px]:max-h-full min-[1425px]:w-80 min-[1425px]:h-full bg-content1 dark:bg-content1 flex-shrink-0">
                        <CardBody className="p-0 overflow-y-auto">
                            <IncidentFilters />
                        </CardBody>
                    </Card>

                    {/* Main Content Container (Flex 1) */}
                    <div className="flex-1 flex flex-col min-h-0">

                        {/* DESKTOP: Table View (> 768px) */}
                        <div ref={tableContainerRef} className="hidden md:flex flex-1 flex-col min-h-0">
                            <div className="flex-1 overflow-auto rounded-t-xl bg-content1 shadow-md">
                                <IncidentsTable />
                            </div>
                            {/* Desktop Pagination with dynamic padding */}
                            <div
                                className="bg-content1 rounded-b-xl flex justify-center shadow-md transition-all duration-200"
                                style={{
                                    paddingTop: `${paginationPadding}px`,
                                    paddingBottom: '12px',
                                    paddingLeft: '12px',
                                    paddingRight: '12px'
                                }}
                            >
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

                        {/* MOBILE: Card List View (< 768px) */}
                        <div className="md:hidden flex-1 flex flex-col min-h-0">
                            <div className="flex-1 overflow-y-auto">
                                <MobileIncidentsView />
                            </div>
                            {/* Mobile Pagination (Simple fixed padding) */}
                            {totalPages > 1 && (
                                <div className="flex justify-center py-4 flex-shrink-0">
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
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Critical Incident Alert Modal */}
            <CriticalIncidentModal
                isOpen={isOpen}
                incident={lastCriticalIncident}
                onClose={handleCloseAlert}
            />
        </div >
    );
}
