import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
    SortDescriptor
} from "@heroui/react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectPaginatedIncidents, patchIncidentStatus, selectFilters } from "./incidentsSlice";
import { useURLSync } from "../../hooks/useURLSync";

export const IncidentsTable = () => {
    const incidents = useAppSelector(selectPaginatedIncidents);
    const filters = useAppSelector(selectFilters);
    const dispatch = useAppDispatch();
    const { updateURL } = useURLSync();

    // Define columns
    const columns = [
        { name: "ID", uid: "id" },
        { name: "TIME", uid: "timestamp", sortable: true },
        { name: "SEVERITY", uid: "severity" },
        { name: "SOURCE", uid: "source" },
        { name: "CATEGORY", uid: "category" },
        { name: "STATUS", uid: "status" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (incident: any, columnKey: React.Key) => {
        const cellValue = incident[columnKey as keyof typeof incident];

        switch (columnKey) {
            case "severity":
                return (
                    <Chip
                        color={
                            incident.severity === "CRITICAL"
                                ? "danger"
                                : incident.severity === "HIGH"
                                    ? "warning"
                                    : incident.severity === "MEDIUM"
                                        ? "primary"
                                        : "default"
                        }
                        size="sm"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={cellValue === "OPEN" ? "success" : cellValue === "ESCALATED" ? "danger" : "default"}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue}
                    </Chip>
                );
            case "timestamp":
                return (
                    <div className="flex flex-col">
                        <span className="text-bold text-small capitalize">
                            {new Date(cellValue).toLocaleTimeString()}
                        </span>
                        <span className="text-tiny text-default-400">
                            {new Date(cellValue).toLocaleDateString()}
                        </span>
                    </div>
                );
            case "actions":
                return (
                    <div className="flex items-center gap-2 justify-end">
                        <Button
                            color="success"
                            size="sm"
                            variant="flat"
                            isDisabled={incident.status === 'RESOLVED'}
                            onPress={() => dispatch(patchIncidentStatus({ id: incident.id, status: 'RESOLVED' }))}
                            className={`font-medium ${incident.status === 'RESOLVED' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            Resolve
                        </Button>
                        <Button
                            color="secondary"
                            size="sm"
                            variant="flat"
                            isDisabled={incident.status === 'ESCALATED' || incident.status === 'RESOLVED'}
                            onPress={() => dispatch(patchIncidentStatus({ id: incident.id, status: 'ESCALATED' }))}
                            className={`font-medium ${incident.status === 'ESCALATED' || incident.status === 'RESOLVED' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            Escalate
                        </Button>
                    </div>
                );
            default:
                return cellValue;
        }
    };


    return (
        <Table
            aria-label="Incidents Table"
            selectionMode="single"
            removeWrapper
            isHeaderSticky
            classNames={{
                wrapper: "bg-content1",
                tr: "cursor-pointer hover:bg-default-100 transition-colors",
                table: "table-fixed",
                th: "!rounded-none"
            }}
            sortDescriptor={{
                column: filters.sortBy,
                direction: filters.sortOrder === 'asc' ? 'ascending' : 'descending'
            }}
            onSortChange={(descriptor: SortDescriptor) => {
                updateURL({
                    sortBy: descriptor.column as string,
                    sortOrder: descriptor.direction === 'ascending' ? 'asc' : 'desc'
                });
            }}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "end" : "start"}
                        allowsSorting={false} // Disable default sorting to hide default icon
                        className="cursor-default" // Use default cursor on the th, pointer on our div
                    >
                        <div
                            className={`flex items-center gap-2 group ${column.uid === 'actions' ? 'justify-end' : ''} ${column.sortable ? 'cursor-pointer select-none hover:opacity-70 transition-opacity' : ''}`}
                            onClick={() => {
                                if (!column.sortable) return;

                                // Helper to get current effective sort state
                                const currentSortBy = filters.sortBy || 'timestamp';
                                const currentSortOrder = filters.sortOrder || 'desc';

                                // Smart default: Severity starts ASC (Critical->Low).
                                // Timestamp also starts ASC (Oldest->Newest) to ensure effective toggle from default DESC view.
                                const defaultDirection = 'asc';

                                let newOrder = defaultDirection;
                                if (currentSortBy === column.uid) {
                                    // If already sorting by this column, toggle
                                    newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
                                }

                                updateURL({
                                    sortBy: column.uid,
                                    sortOrder: newOrder
                                });
                            }}
                        >
                            <span className="text-small font-semibold relative z-10">{column.name}</span>
                            {column.sortable && (
                                <svg
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${(filters.sortOrder || 'desc') === 'asc' ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </div>
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={incidents} emptyContent={"No incidents found."}>
                {(item: any) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
