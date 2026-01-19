import { useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Divider,
    Spinner,
    Button,
} from "@heroui/react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
    fetchIncidents,
    selectAllIncidents,
    selectIncidentsStatus,
    selectIncidentsError,
} from "../features/incidents/incidentsSlice";
import { logout } from "../features/auth/authSlice";

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const incidents = useAppSelector(selectAllIncidents);
    const status = useAppSelector(selectIncidentsStatus);
    const error = useAppSelector(selectIncidentsError);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchIncidents());
        }
    }, [status, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
    };

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Security Operations Center
                        </h1>
                        <p className="text-small text-default-500">Real-time Incident Dashboard</p>
                    </div>
                    <Button color="danger" variant="flat" onPress={handleLogout}>
                        Logout
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardBody>
                            <p className="text-sm text-default-500">Active Incidents</p>
                            <p className="text-2xl font-semibold">{incidents.length}</p>
                        </CardBody>
                    </Card>
                    {/* Add more summary cards here later */}
                </div>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Recent Incidents</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <div className="space-y-4">
                            {incidents.slice(0, 5).map((incident) => (
                                <div key={incident.id} className="p-4 border rounded-lg dark:border-gray-700 bg-content2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{incident.category}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${incident.severity === 'CRITICAL' ? 'bg-danger/20 text-danger' :
                                                incident.severity === 'HIGH' ? 'bg-warning/20 text-warning' :
                                                    'bg-default/20 text-default-500'
                                            }`}>
                                            {incident.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-default-500 mt-1">{incident.source}</p>
                                    <p className="text-xs text-default-400 mt-2">
                                        {new Date(incident.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                            {incidents.length === 0 && (
                                <p className="text-center text-default-500">No incidents found.</p>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
