/**
 * Formats an incident timestamp for display in the table
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string (e.g., "Jan 20, 2026 15:30")
 */
export const formatIncidentTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).replace(" at", "");
};
