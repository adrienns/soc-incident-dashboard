export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'OPEN' | 'RESOLVED' | 'ESCALATED';
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export const SEVERITIES: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export const STATUSES: Status[] = ['OPEN', 'RESOLVED', 'ESCALATED'];

export const CATEGORIES = [
    'Malware',
    'Intrusion',
    'Data Exfiltration',
    'DDoS',
    'Phishing',
    'Unauthorized Access',
] as const;

export const SEVERITY_ORDER: Record<Severity, number> = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
};
