import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button
} from "@heroui/react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectPaginatedIncidents, patchIncidentStatus } from "./incidentsSlice";

export const IncidentsTable = () => {
    const incidents = useAppSelector(selectPaginatedIncidents);
    const dispatch = useAppDispatch();

    // Define columns
    const columns = [
        { name: "ID", uid: "id" },
        { name: "TIMESTAMP", uid: "timestamp" },
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
                    <div className="flex items-center gap-2">
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
                            color="danger"
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
        <Table aria-label="Incidents Table" selectionMode="single" classNames={{
            wrapper: "bg-content1",
            tr: "cursor-pointer hover:bg-default-100 transition-colors",
        }}>
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
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
