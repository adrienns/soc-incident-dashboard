import { Checkbox, Input, Button, Card, CardBody, Accordion, AccordionItem } from "@heroui/react";
import { useURLSync } from "../../hooks/useURLSync";
import { useAppSelector } from "../../hooks";
import { selectFilters } from "./incidentsSlice";
import { SEVERITIES, STATUSES, CATEGORIES } from "../../constants/incidents";
import { AccordionRadioFilter } from "../../components/ui/AccordionRadioFilter";
import { getSeverityBgColor } from "../../utils/severity";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export const IncidentFilters = () => {
    const { updateURL, clearURL } = useURLSync();
    const filters = useAppSelector(selectFilters);
    const isLargeScreen = useMediaQuery('(min-width: 1425px)');

    const handleSeverityChange = (values: string[]) => {
        updateURL({ severity: values.length > 0 ? values.join(',') : null });
    };



    return (
        <div className="flex flex-col gap-6 p-4 h-full">
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
                            inputWrapper: "bg-default-100/50 hover:bg-default-200/50 group-data-[focus=true]:bg-default-100"
                        }}
                        endContent={
                            <svg className="w-4 h-4 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        }
                    />
                </div>

                {/* Filter Grid: Row < 1425, Col >= 1425 */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-start min-[1425px]:flex min-[1425px]:flex-col min-[1425px]:items-stretch gap-4">
                    {/* Severity */}
                    <Card className="bg-content2/50 border border-default-100 shadow-sm px-0 py-0" shadow="sm">
                        <CardBody className="p-0">
                            <Accordion
                                key={`severity-${isLargeScreen ? 'expanded' : 'collapsed'}`}
                                isCompact
                                showDivider={false}
                                defaultExpandedKeys={isLargeScreen ? ["severity"] : []}
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
                        key={`status-${isLargeScreen ? 'expanded' : 'collapsed'}`}
                        title="Status"
                        value={filters.status}
                        options={STATUSES}
                        onChange={(val) => updateURL({ status: val })}
                        defaultExpandedKeys={isLargeScreen ? ["status"] : []}
                        wrapperClassName={isLargeScreen ? undefined : "grid grid-cols-2 gap-2"}
                    />

                    {/* Category Filter */}
                    <AccordionRadioFilter
                        key={`category-${isLargeScreen ? 'expanded' : 'collapsed'}`}
                        title="Category"
                        value={filters.category}
                        options={CATEGORIES}
                        onChange={(val) => updateURL({ category: val })}
                        defaultExpandedKeys={isLargeScreen ? ["category"] : []}
                        wrapperClassName={isLargeScreen ? undefined : "grid grid-cols-2 gap-2"}
                    />
                </div>
            </div>
        </div>
    );
};
