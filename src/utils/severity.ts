import type { Severity } from '../constants/incidents';

/**
 * Single source of truth for severity color mapping
 */
const SEVERITY_COLORS = {
    CRITICAL: 'danger',
    HIGH: 'warning',
    MEDIUM: 'primary',
    LOW: 'default',
} as const;

/**
 * Maps severity levels to their corresponding HeroUI color variants
 * Used for components like Chip, Button, etc.
 */
export const getSeverityColor = (severity: Severity): 'danger' | 'warning' | 'primary' | 'default' => {
    return SEVERITY_COLORS[severity];
};

/**
 * Maps severity levels to their corresponding Tailwind background color classes
 */
export const getSeverityBgColor = (severity: Severity): string => {
    return `bg-${getSeverityColor(severity)}`;
};
