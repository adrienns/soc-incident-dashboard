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
                <Card key={incident.id} className="w-full bg-[#27272a] shadow-md">
                    <CardHeader className="justify-between pb-2 bg-[#27272a]">
                        <div className="flex flex-col">
                            <span className="text-small font-bold text-default-500 truncate max-w-[150px]">
                                {incident.id}
                            </span>
                        </div>
                        <span className="text-tiny text-default-500">
                            {formatIncidentTimestamp(incident.timestamp)}
                        </span>
                    </CardHeader>
                    <CardBody className="py-2 gap-3 bg-[#27272a]">
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
                                <span className="text-default-500">{incident.source}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Category:</span>
                                <span className="text-default-500">{incident.category}</span>
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="justify-end gap-2 pt-2 bg-[#27272a]">
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
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};
