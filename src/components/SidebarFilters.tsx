import { Checkbox, Input, Button, Accordion, AccordionItem, RadioGroup, Radio, Card, CardBody, CardHeader } from "@heroui/react";
import { useURLSync } from "../hooks/useURLSync";
import { useAppSelector } from "../hooks";
import { selectFilters } from "../features/incidents/incidentsSlice";
import { SEVERITIES, STATUSES, CATEGORIES } from "../constants/incidents";

export const SidebarFilters = () => {
    const { updateURL, clearURL } = useURLSync();
    const filters = useAppSelector(selectFilters);

    const handleSeverityChange = (values: string[]) => {
        updateURL({ severity: values.length > 0 ? values.join(',') : null });
    };

    // Card styling constant
    const cardClassName = "bg-content2/50 border border-default-100 shadow-sm px-0 py-0"; // Padding handled inside
    const headerClassName = "pb-0 pt-3 px-4 flex-col items-start";
    const titleClassName = "text-xs font-semibold text-default-500 uppercase tracking-wider";

    // Accordion styling override to match card look inside card
    const accordionItemClasses = {
        title: "text-xs font-semibold text-default-500 uppercase tracking-wider",
        trigger: "px-4 py-3 data-[hover=true]:bg-default-100/50 rounded-lg",
        indicator: "text-default-400",
        content: "px-4 pb-4 pt-0",
    };

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
                        startContent={
                            <svg className="w-4 h-4 text-default-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                        classNames={{
                            inputWrapper: "bg-default-100/50 border-1 border-default-200 hover:border-default-300 group-data-[focus=true]:border-primary h-8 min-h-unit-8"
                        }}
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
                                        label: "text-tiny text-default-500 w-full",
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

            {/* Status Accordion Card */}
            <Card className={cardClassName} shadow="sm">
                <CardBody className="p-0">
                    <Accordion isCompact showDivider={false}>
                        <AccordionItem
                            key="status"
                            aria-label="Status"
                            title="Status"
                            classNames={accordionItemClasses}
                        >
                            <RadioGroup
                                value={filters.status || ''}
                                onValueChange={(val) => updateURL({ status: val || null })}
                                size="sm"
                                color="primary"
                            >
                                {STATUSES.map((status) => (
                                    <Radio
                                        key={status}
                                        value={status}
                                        classNames={{ label: "text-small text-default-500 pl-2" }}
                                    >
                                        {status}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </AccordionItem>
                    </Accordion>
                </CardBody>
            </Card>

            {/* Category Accordion Card */}
            <Card className={cardClassName} shadow="sm">
                <CardBody className="p-0">
                    <Accordion isCompact showDivider={false}>
                        <AccordionItem
                            key="category"
                            aria-label="Category"
                            title="Category"
                            classNames={accordionItemClasses}
                        >
                            <RadioGroup
                                value={filters.category || ''}
                                onValueChange={(val) => updateURL({ category: val || null })}
                                size="sm"
                                color="primary"
                            >
                                {CATEGORIES.map((cat) => (
                                    <Radio
                                        key={cat}
                                        value={cat}
                                        classNames={{ label: "text-small text-default-500 pl-2" }}
                                    >
                                        {cat}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </AccordionItem>
                    </Accordion>
                </CardBody>
            </Card>

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
