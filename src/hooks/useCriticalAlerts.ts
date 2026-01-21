import { useEffect } from "react";
import { useAppSelector } from "../hooks";
import { selectLastCriticalIncident } from "../features/incidents/incidentsSlice";

export const useCriticalAlerts = (onAlert: () => void) => {
    const lastCriticalIncident = useAppSelector(selectLastCriticalIncident);

    useEffect(() => {
        if (lastCriticalIncident) {
            onAlert();
        }
    }, [lastCriticalIncident, onAlert]);

    return { lastCriticalIncident };
};
