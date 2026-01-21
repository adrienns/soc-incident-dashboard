import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { websocketManager } from "../services/websocket";

export const useRealtimeUpdates = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        websocketManager.init(dispatch);

        if (token) {
            websocketManager.connect(token);
        }

        return () => {
            websocketManager.disconnect();
        };
    }, [dispatch, token]);

    return {
        disconnect: () => websocketManager.disconnect()
    };
};
