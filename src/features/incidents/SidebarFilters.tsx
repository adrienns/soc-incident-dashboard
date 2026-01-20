import { Checkbox, Input, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useURLSync } from "../../hooks/useURLSync";
import { useAppSelector } from "../../hooks";
import { selectFilters } from "./incidentsSlice";
import { SEVERITIES, STATUSES, CATEGORIES } from "../../constants/incidents";
import { AccordionRadioFilter } from "../../components/ui/AccordionRadioFilter";

export const SidebarFilters = () => {
    const { updateURL, clearURL } = useURLSync();
    const filters = useAppSelector(selectFilters);

    const handleSeverityChange = (values: string[]) => {
        updateURL({ severity: values.length > 0 ? values.join(',') : null });
    };

    // Card styling constant
    const headerClassName = "pb-0 pt-3 px-4 flex-col items-start";
    const titleClassName = "text-xs font-semibold text-default-500 uppercase tracking-wider";

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2 pb-4">
            <div className="flex justify-between items-center sticky top-0 z-10 bg-content1 py-2">
                <h3 className="text-sm font-bold text-default-700 dark:text-default-300 uppercase tracking-wider">Filter By</h3>
                <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    className="text-danger font-medium px-2 min-w-0 h-8"
                    onPress={clearURL}
                >
                    Reset
                </Button>
            </div>

            {/* Search Card */}
            <Card className="bg-content2/50 border border-default-100 shadow-sm" shadow="sm">
                <CardBody className="p-3">
                    <Input
                        placeholder="Search IP..."
                        value={filters.search}
                        onValueChange={(val) => updateURL({ search: val || null })}
                        size="sm"
                        isClearable
                        onClear={() => updateURL({ search: null })}
                    />
                </CardBody>
            </Card>

            {/* Severity Card */}
            <Card className="bg-content2/50 border border-default-100 shadow-sm" shadow="sm">
                <CardHeader className={headerClassName}>
                    <p className={titleClassName}>Severity</p>
                </CardHeader>
                <CardBody className="py-3 px-4">
                    <div className="grid grid-cols-2 gap-2">
                        {SEVERITIES.map((sev) => {
                            const colorClass =
                                sev === 'CRITICAL' ? 'bg-danger' :
                                    sev === 'HIGH' ? 'bg-danger-400' :
                                        sev === 'MEDIUM' ? 'bg-warning' : 'bg-default-400';

                            return (
                                <Checkbox
                                    key={sev}
                                    value={sev}
                                    isSelected={filters.severities.includes(sev)}
                                    onValueChange={(isSelected) => {
                                        const newSeverities = isSelected
                                            ? [...filters.severities, sev]
                                            : filters.severities.filter(s => s !== sev);
                                        handleSeverityChange(newSeverities);
                                    }}
                                    classNames={{
                                        base: "cursor-pointer",
                                        label: "text-tiny text-default-500 w-full cursor-pointer",
                                        wrapper: "before:border-default-400"
                                    }}
                                    size="sm"
                                    color="default"
                                    icon={<div className={`w-2 h-2 rounded-sm ${colorClass}`} />}
                                >
                                    {sev}
                                </Checkbox>
                            );
                        })}
                    </div>
                </CardBody>
            </Card>

            {/* Status Filter */}
            <AccordionRadioFilter
                title="Status"
                value={filters.status}
                options={STATUSES}
                onChange={(val) => updateURL({ status: val })}
            />

            {/* Category Filter */}
            <AccordionRadioFilter
                title="Category"
                value={filters.category}
                options={CATEGORIES}
                onChange={(val) => updateURL({ category: val })}
            />

            {/* Sort Section */}
            <div className="mt-2">
                <h3 className="text-sm font-bold text-default-700 dark:text-default-300 uppercase tracking-wider mb-2">Sort By</h3>
                <Card className="bg-content2/50 border border-default-100 shadow-sm" shadow="sm">
                    <CardBody className="p-2 gap-1">
                        <div
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${filters.sortBy === 'timestamp' && filters.sortOrder === 'desc' ? 'bg-default-200/60' : 'hover:bg-default-100/50'}`}
                            onClick={() => updateURL({ sortBy: 'timestamp', sortOrder: 'desc' })}
                        >
                            <span className="text-small font-medium">Newest incidents</span>
                            {filters.sortBy === 'timestamp' && (
                                <svg className="w-4 h-4 text-default-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            )}
                        </div>
                        <div
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${filters.sortBy === 'severity' ? 'bg-default-200/60' : 'hover:bg-default-100/50'}`}
                            onClick={() => updateURL({ sortBy: 'severity', sortOrder: 'asc' })}
                        >
                            <span className="text-small font-medium">Severity (Critical First)</span>
                            {filters.sortBy === 'severity' && (
                                <svg className="w-4 h-4 text-default-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
