import { Checkbox, Input, Button } from "@heroui/react";
import { useURLSync } from "../../hooks/useURLSync";
import { useAppSelector } from "../../hooks";
import { selectFilters } from "./incidentsSlice";
import { SEVERITIES, STATUSES, CATEGORIES } from "../../constants/incidents";
import { AccordionRadioFilter } from "../../components/ui/AccordionRadioFilter";
import { getSeverityBgColor } from "../../utils/severity";

export const IncidentFilters = () => {
    const { updateURL, clearURL } = useURLSync();
    const filters = useAppSelector(selectFilters);

    const handleSeverityChange = (values: string[]) => {
        updateURL({ severity: values.length > 0 ? values.join(',') : null });
    };

    // Card styling constant
    const titleClassName = "text-xs font-semibold text-default-500 uppercase tracking-wider mb-2 ml-1";

    return (
        <div className="flex flex-col gap-6 p-4 h-full">
            <div className="flex justify-between items-center bg-content1">
                <h3 className="text-lg font-bold text-default-700 dark:text-default-300 tracking-tight">Filters</h3>
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

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <Input
                        placeholder="Search by Source IP"
                        value={filters.search}
                        onValueChange={(val) => updateURL({ search: val || null })}
                        size="sm"
                        isClearable
                        onClear={() => updateURL({ search: null })}
                        classNames={{
                            inputWrapper: "bg-default-100/50 hover:bg-default-200/50 group-data-[focus=true]:bg-default-100"
                        }}
                        endContent={
                            <svg className="w-4 h-4 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        }
                    />
                </div>

                {/* Severity */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={titleClassName}>Severity</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {SEVERITIES.map((sev) => {
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
                                        base: "cursor-pointer m-0",
                                        label: "text-tiny text-default-500 w-full cursor-pointer",
                                        wrapper: "before:border-default-400"
                                    }}
                                    size="sm"
                                    color="default"
                                    icon={<div className={`w-2 h-2 rounded-sm ${getSeverityBgColor(sev)}`} />}
                                >
                                    {sev}
                                </Checkbox>
                            );
                        })}
                    </div>
                </div>

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
            </div>
        </div>
    );
};
