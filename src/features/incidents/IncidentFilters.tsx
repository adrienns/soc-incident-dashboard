import { Checkbox, Input, Button, Card, CardBody, Accordion, AccordionItem } from "@heroui/react";
import { useURLSync } from "../../hooks/useURLSync";
import { useAppSelector } from "../../hooks";
import { selectFilters } from "./incidentsSlice";
import { SEVERITIES, STATUSES, CATEGORIES } from "../../constants/incidents";
import { AccordionRadioFilter } from "../../components/ui/AccordionRadioFilter";
import { getSeverityBgColor } from "../../utils/severity";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface IncidentFiltersProps {
    isInDrawer?: boolean;
}

export const IncidentFilters = ({ isInDrawer = false }: IncidentFiltersProps) => {
    const { updateURL, clearURL } = useURLSync();
    const filters = useAppSelector(selectFilters);
    const isLargeScreen = useMediaQuery('(min-width: 1425px)');

    const handleSeverityChange = (values: string[]) => {
        updateURL({ severity: values.length > 0 ? values.join(',') : null });
    };

    // In drawer mode, always expand all accordions for better mobile UX
    const shouldExpandAccordions = isInDrawer || isLargeScreen;

    return (
        <div className={isInDrawer ? "flex flex-col gap-6 p-6" : "flex flex-col gap-6 p-4 h-full"}>
            {!isInDrawer && (
                <div className="flex justify-between items-center bg-content1">
                    <h3 className="text-lg font-bold text-default-700 dark:text-default-300 tracking-tight">Filters</h3>
                    <Button
                        size="sm"
                        variant="ghost"
                        color="default"
                        className="text-default-400 hover:text-default-500 min-w-0"
                        onPress={clearURL}
                    >
                        Reset
                    </Button>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {/* Search */}
                <div>
                    <Input
                        placeholder="Search by Source IP"
                        value={filters.search}
                        onValueChange={(val) => updateURL({ search: val || null })}
                        size="lg"
                        isClearable
                        onClear={() => updateURL({ search: null })}
                        classNames={{
                            inputWrapper: "bg-[#27272a] hover:bg-[#3f3f46] group-data-[focus=true]:bg-[#3f3f46] border border-[#3f3f46]",
                            input: "text-default-300"
                        }}
                        endContent={
                            <svg className="w-4 h-4 text-default-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        }
                    />
                </div>

                {/* Filter Grid: Single column in drawer, responsive grid otherwise */}
                <div className={isInDrawer ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-3 items-start min-[1425px]:flex min-[1425px]:flex-col min-[1425px]:items-stretch gap-4"}>
                    {/* Severity */}
                    <Card className="bg-[#27272a] border border-[#3f3f46] shadow-sm px-0 py-0" shadow="sm">
                        <CardBody className="p-0">
                            <Accordion
                                key={isInDrawer ? 'drawer-severity' : `severity-${isLargeScreen ? 'expanded' : 'collapsed'}`}
                                isCompact
                                showDivider={false}
                                defaultExpandedKeys={shouldExpandAccordions ? ["severity"] : []}
                            >
                                <AccordionItem
                                    key="severity"
                                    aria-label="Severity"
                                    title="Severity"
                                    classNames={{
                                        title: "text-xs font-semibold text-default-500 uppercase tracking-wider",
                                        trigger: "px-4 py-3 rounded-lg",
                                        indicator: "text-default-400",
                                        content: "px-4 pb-4 pt-0",
                                    }}
                                >
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
                                                        wrapper: `before:border-default-400 group-data-[selected=true]:!${getSeverityBgColor(sev)} group-data-[selected=true]:!border-${getSeverityBgColor(sev).replace('bg-', '')} text-white`
                                                    }}
                                                    size="sm"
                                                    color="default"
                                                    icon={<svg
                                                        className="w-3 h-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>}
                                                >
                                                    {sev}
                                                </Checkbox>
                                            );
                                        })}
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </CardBody>
                    </Card>

                    {/* Status Filter */}
                    <AccordionRadioFilter
                        key={isInDrawer ? 'drawer-status' : `status-${isLargeScreen ? 'expanded' : 'collapsed'}`}
                        title="Status"
                        value={filters.status}
                        options={STATUSES}
                        onChange={(val) => updateURL({ status: val })}
                        defaultExpandedKeys={shouldExpandAccordions ? ["status"] : []}
                    />

                    {/* Category Filter */}
                    <AccordionRadioFilter
                        key={isInDrawer ? 'drawer-category' : `category-${isLargeScreen ? 'expanded' : 'collapsed'}`}
                        title="Category"
                        value={filters.category}
                        options={CATEGORIES}
                        onChange={(val) => updateURL({ category: val })}
                        defaultExpandedKeys={shouldExpandAccordions ? ["category"] : []}
                        wrapperClassName={isLargeScreen ? undefined : "grid grid-cols-2 gap-2"}
                    />
                </div>
            </div>
        </div>
    );
};
