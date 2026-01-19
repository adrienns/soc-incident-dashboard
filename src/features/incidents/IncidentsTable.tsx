import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    Button
} from "@heroui/react";
import { useAppSelector } from "../../hooks";
import { selectFilteredIncidents } from "./incidentsSlice";
import { SEVERITY_ORDER } from "../../constants/incidents";

export const IncidentsTable = () => {
    const incidents = useAppSelector(selectFilteredIncidents);

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
                        color={cellValue === "OPEN" ? "success" : "default"}
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
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Resolve Incident">
                            <span className="text-lg text-success cursor-pointer active:opacity-50">
                                <svg
                                    aria-hidden="true"
                                    fill="none"
                                    focusable="false"
                                    height="1em"
                                    role="presentation"
                                    viewBox="0 0 24 24"
                                    width="1em"
                                >
                                    <path
                                        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>
                        </Tooltip>
                        {/* Escalate or View Details */}
                    </div>
                );
            default:
                return cellValue;
        }
    };

    return (
        <Table aria-label="Incidents Table" selectionMode="single" classNames={{
            wrapper: "bg-content1",
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
