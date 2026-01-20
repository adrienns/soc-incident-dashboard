import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Chip,
    Button
} from "@heroui/react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectPaginatedIncidents, patchIncidentStatus } from "./incidentsSlice";
import { getSeverityColor, getStatusColor } from "../../utils/severity";
import { formatIncidentTimestamp } from "../../utils/date";

export const MobileIncidentsView = () => {
    const incidents = useAppSelector(selectPaginatedIncidents);
    const dispatch = useAppDispatch();

    if (incidents.length === 0) {
        return (
            <div className="text-center p-8 text-default-500">
                No incidents found.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 pb-4">
            {incidents.map((incident: any) => (
                <Card key={incident.id} className="w-full bg-[#27272a]">
                    <CardHeader className="justify-between pb-2">
                        <div className="flex flex-col">
                            <span className="text-small font-bold text-default-600 truncate max-w-[150px]">
                                {incident.id}
                            </span>
                        </div>
                        <span className="text-tiny text-default-400">
                            {formatIncidentTimestamp(incident.timestamp)}
                        </span>
                    </CardHeader>
                    <CardBody className="py-2 gap-3">
                        <div className="flex gap-2">
                            <Chip
                                color={getSeverityColor(incident.severity)}
                                size="sm"
                                variant="flat"
                            >
                                {incident.severity}
                            </Chip>
                            <Chip
                                className="capitalize"
                                color={getStatusColor(incident.status)}
                                size="sm"
                                variant="dot"
                            >
                                {incident.status}
                            </Chip>
                        </div>
                        <div className="flex flex-col gap-1 text-small text-default-500">
                            <div className="flex justify-between">
                                <span>Source:</span>
                                <span className="text-default-300">{incident.source}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Category:</span>
                                <span className="text-default-300">{incident.category}</span>
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="justify-end gap-2 pt-2">
                        <Button
                            isIconOnly
                            color="success"
                            size="sm"
                            variant="flat"
                            isDisabled={incident.status === 'RESOLVED'}
                            onPress={() => dispatch(patchIncidentStatus({ id: incident.id, status: 'RESOLVED' }))}
                            className={incident.status === 'RESOLVED' ? 'opacity-30' : ''}
                            aria-label="Resolve"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </Button>
                        <Button
                            isIconOnly
                            color="secondary" // Kept secondary to match theme, or warning if preferred
                            size="sm"
                            variant="flat"
                            isDisabled={incident.status === 'ESCALATED' || incident.status === 'RESOLVED'}
                            onPress={() => dispatch(patchIncidentStatus({ id: incident.id, status: 'ESCALATED' }))}
                            className={incident.status === 'ESCALATED' || incident.status === 'RESOLVED' ? 'opacity-30' : ''}
                            aria-label="Escalate"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};
