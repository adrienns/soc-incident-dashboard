import { useMemo } from 'react';
import { Button, Chip } from '@heroui/react';
import type { SharedSelection } from '@heroui/react';
import { useURLSync } from '../../hooks/useURLSync';
import { useAppSelector } from '../../hooks';
import {
    selectFilters,
    selectAllIncidents,
    selectFilteredIncidents,
} from './incidentsSlice';
import {
    CATEGORIES,
    SEVERITIES,
    STATUSES,
} from '../../constants/incidents';
import { SearchBar } from '../../components/SearchBar';
import { Dropdown, type DropdownOption } from '../../components/Dropdown';

// Constants imported from ../../constants/incidents

const severityOptions: DropdownOption[] = SEVERITIES.map((severity) => ({
    key: severity,
    label: severity,
    renderLabel: (
        <span className={
            severity === 'CRITICAL' ? 'text-danger' :
                severity === 'HIGH' ? 'text-warning' :
                    severity === 'MEDIUM' ? 'text-primary' :
                        'text-default-500'
        }>
            {severity}
        </span>
    ),
}));

const statusOptions: DropdownOption[] = STATUSES.map((status) => ({
    key: status,
    label: status,
}));

const categoryOptions: DropdownOption[] = CATEGORIES.map((category) => ({
    key: category,
    label: category,
}));

export const FilterBar = () => {
    const { updateURL, clearURL } = useURLSync();
    const filters = useAppSelector(selectFilters);
    const allIncidents = useAppSelector(selectAllIncidents);
    const filteredIncidents = useAppSelector(selectFilteredIncidents);

    const hasActiveFilters = useMemo(() => {
        return (
            filters.severities.length > 0 ||
            filters.status !== null ||
            filters.category !== null ||
            filters.search !== ''
        );
    }, [filters]);

    const handleSeverityChange = (keys: SharedSelection) => {
        if (keys === 'all') {
            updateURL({ severity: SEVERITIES.join(',') });
        } else {
            const selected = Array.from(keys as Set<string>);
            updateURL({ severity: selected.length > 0 ? selected.join(',') : null });
        }
    };

    const handleStatusChange = (keys: SharedSelection) => {
        if (keys === 'all') {
            updateURL({ status: null });
        } else {
            const keysSet = keys as Set<string>;
            const selected = Array.from(keysSet)[0] || null;
            updateURL({ status: selected });
        }
    };

    const handleCategoryChange = (keys: SharedSelection) => {
        if (keys === 'all') {
            updateURL({ category: null });
        } else {
            const keysSet = keys as Set<string>;
            const selected = Array.from(keysSet)[0] || null;
            updateURL({ category: selected });
        }
    };

    const handleSearchChange = (value: string) => {
        updateURL({ search: value || null });
    };

    const handleSearchClear = () => {
        updateURL({ search: null });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
                <SearchBar
                    value={filters.search}
                    onChange={handleSearchChange}
                    onClear={handleSearchClear}
                    placeholder="Search by source IP..."
                />

                <Dropdown
                    label="Severity"
                    placeholder="All severities"
                    options={severityOptions}
                    selectedKeys={new Set(filters.severities)}
                    onSelectionChange={handleSeverityChange}
                    selectionMode="multiple"
                />

                <Dropdown
                    label="Status"
                    placeholder="All statuses"
                    options={statusOptions}
                    selectedKeys={filters.status ? new Set([filters.status]) : new Set()}
                    onSelectionChange={handleStatusChange}
                    className="w-full sm:w-40"
                />

                <Dropdown
                    label="Category"
                    placeholder="All categories"
                    options={categoryOptions}
                    selectedKeys={filters.category ? new Set([filters.category]) : new Set()}
                    onSelectionChange={handleCategoryChange}
                />

                <Dropdown
                    label="Sort By"
                    placeholder="Sort order"
                    options={[
                        { key: 'timestamp-desc', label: 'Newest First' },
                        { key: 'timestamp-asc', label: 'Oldest First' },
                        { key: 'severity-asc', label: 'Severity (High-Low)' }, // 'asc' in logic means diff is positive (Critical=0 < Low=3), but standard sort puts small first. Let's check logic.
                        // Logic: diff = SEV[a] - SEV[b]. if asc, a-b. Critical(0)-Low(3) = -3. So Critical comes first. 
                        // So 'asc' = Critical (0) to Low (3).
                        { key: 'severity-desc', label: 'Severity (Low-High)' },
                    ]}
                    selectedKeys={new Set([`${filters.sortBy}-${filters.sortOrder}`])}
                    onSelectionChange={(keys) => {
                        const selected = Array.from(keys as Set<string>)[0];
                        if (selected) {
                            const [sortBy, sortOrder] = selected.split('-');
                            updateURL({ sortBy, sortOrder });
                        }
                    }}
                    className="w-full sm:w-48"
                />

                {hasActiveFilters && (
                    <Button
                        variant="flat"
                        color="danger"
                        size="sm"
                        onPress={clearURL}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 text-sm text-default-500">
                <span>
                    Showing {filteredIncidents.length} of {allIncidents.length} incidents
                </span>
                {hasActiveFilters && (
                    <div className="flex gap-1 flex-wrap">
                        {filters.severities.map((sev) => (
                            <Chip key={sev} size="sm" variant="flat" color={
                                sev === 'CRITICAL' ? 'danger' :
                                    sev === 'HIGH' ? 'warning' :
                                        sev === 'MEDIUM' ? 'primary' :
                                            'default'
                            }>
                                {sev}
                            </Chip>
                        ))}
                        {filters.status && (
                            <Chip size="sm" variant="flat">{filters.status}</Chip>
                        )}
                        {filters.category && (
                            <Chip size="sm" variant="flat">{filters.category}</Chip>
                        )}
                        {filters.search && (
                            <Chip size="sm" variant="flat">IP: {filters.search}</Chip>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
