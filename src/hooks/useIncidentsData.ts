import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchIncidents, selectIncidentsStatus } from "../features/incidents/incidentsSlice";

export const useIncidentsData = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectIncidentsStatus);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchIncidents());
        }
    }, [status, dispatch]);
};
