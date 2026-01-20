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
import { getSeverityColor, getStatusColor } from "../../utils/severity";
import { formatIncidentTimestamp } from "../../utils/date";

export const IncidentsTable = () => {
    const incidents = useAppSelector(selectPaginatedIncidents);
    const filters = useAppSelector(selectFilters);
    const dispatch = useAppDispatch();
    const { updateURL } = useURLSync();

    // Define columns
    const columns = [
        { name: "ID", uid: "id", width: "25%" },
        { name: "TIME", uid: "timestamp", sortable: true, width: "15%" },
        { name: "SEVERITY", uid: "severity", width: "10%" },
        { name: "SOURCE", uid: "source", width: "15%" },
        { name: "CATEGORY", uid: "category", width: "10%" },
        { name: "STATUS", uid: "status", width: "10%" },
        { name: "ACTIONS", uid: "actions", width: "15%" },
    ];

    const renderCell = (incident: any, columnKey: React.Key) => {
        const cellValue = incident[columnKey as keyof typeof incident];

        switch (columnKey) {
            case "severity":
                return (
                    <Chip
                        color={getSeverityColor(incident.severity)}
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
                        color={getStatusColor(cellValue)}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue}
                    </Chip>
                );
            case "timestamp":
                return (
                    <span className="text-small text-default-500">
                        {formatIncidentTimestamp(cellValue)}
                    </span>
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
            classNames={{
                wrapper: "bg-[#27272a] rounded-lg p-0", // Uniform light gray body
                th: "bg-[#18181b] text-default-500 text-tiny uppercase font-bold text-[0.70rem] tracking-wider py-[20px] px-4 first:rounded-tl-lg last:rounded-tr-lg", // Darker header
                tr: "hover:bg-[#3f3f46]/40 cursor-pointer transition-colors border-b border-[#3f3f46] last:border-none", // Uniform rows (transparent), visible dividers
                td: "py-2 px-4 text-default-500", // Standard padding, muted gray text
                thead: "[&>tr]:first:shadow-none",
                table: "table-fixed",
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
                        width={(column as any).width}
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
                    <TableRow key={item.id} className={item.status === 'RESOLVED' ? 'opacity-50' : ''}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
