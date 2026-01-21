import { Select, SelectItem, Card, CardBody, Chip } from "@heroui/react";
import { useURLSync } from "../../hooks/useURLSync";
import { useAppSelector } from "../../hooks";
import { selectFilters } from "./incidentsSlice";
import { SEVERITIES, STATUSES, CATEGORIES } from "../../constants/incidents";
import { getSeverityColor } from "../../utils/severity";
import { ClearFiltersButton } from "../../components/ui/ClearFiltersButton";
import { SearchBar } from "../../components/ui/SearchBar";

export const IncidentFiltersTabletView = () => {
    const { updateURL, clearURL } = useURLSync();
    const filters = useAppSelector(selectFilters);

    const handleSeverityChange = (keys: Set<string>) => {
        const values = Array.from(keys);
        updateURL({ severity: values.length > 0 ? values.join(',') : null });
    };

    return (
        <Card className="bg-content1 shadow-sm">
            <CardBody className="p-3 gap-3">
                {/* First Row: Search + Action Buttons */}
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <SearchBar
                            value={filters.search || ''}
                            onChange={(val) => updateURL({ search: val })}
                            size="lg"
                        />
                    </div>
                    <ClearFiltersButton
                        onClear={clearURL}
                        className="min-w-[70px]"
                    />
                </div>

                {/* Second Row: Filter Selects */}
                <div className="flex items-center gap-2">
                    {/* Severity Multi-Select */}
                    <Select
                        aria-label="Severity"
                        placeholder="Severity"
                        selectionMode="multiple"
                        selectedKeys={new Set(filters.severities)}
                        onSelectionChange={(keys) => handleSeverityChange(keys as Set<string>)}
                        size="sm"
                        classNames={{
                            base: "flex-1",
                            trigger: "bg-[#27272a] border-[#3f3f46] hover:bg-[#3f3f46] data-[open=true]:hover:bg-[#27272a] min-h-[40px] data-[open=true]:rounded-b-none data-[open=true]:border-b-0",
                            value: "text-default-500",
                            label: "text-default-500 text-xs group-data-[filled=true]:-translate-y-0 group-data-[filled=true]:scale-100",
                            popoverContent: "bg-[#27272a] shadow-none border border-[#3f3f46] border-t-0 rounded-t-none -mt-[6px]",
                            listbox: "bg-[#27272a]",
                            listboxWrapper: "text-default-300"
                        }}
                        listboxProps={{
                            itemClasses: {
                                base: "data-[hover=true]:!bg-[#3f3f46] data-[focus=true]:!bg-[#3f3f46] data-[selectable=true]:focus:!bg-[#3f3f46] data-[hover=true]:text-white data-[focus=true]:text-white data-[selectable=true]:focus:text-white"
                            }
                        }}
                        popoverProps={{
                            className: "z-[50000]"
                        }}
                        renderValue={(items) => {
                            if (items.length === 0) return null;
                            return (
                                <div className="flex gap-1 flex-wrap">
                                    {items.map((item) => {
                                        const key = String(item.key);
                                        return (
                                            <Chip
                                                key={key}
                                                color={getSeverityColor(key as any)}
                                                size="sm"
                                                variant="flat"
                                            >
                                                {item.textValue}
                                            </Chip>
                                        );
                                    })}
                                </div>
                            );
                        }}
                    >
                        {SEVERITIES.map((sev) => (
                            <SelectItem key={sev} textValue={sev}>
                                <Chip color={getSeverityColor(sev)} size="sm" variant="flat">
                                    {sev}
                                </Chip>
                            </SelectItem>
                        ))}
                    </Select>

                    {/* Status Select */}
                    <Select
                        aria-label="Status"
                        placeholder="Status"
                        selectedKeys={filters.status ? [filters.status] : []}
                        onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as string;
                            updateURL({ status: value || null });
                        }}
                        size="sm"
                        classNames={{
                            base: "flex-1",
                            trigger: "bg-[#27272a] border-[#3f3f46] hover:bg-[#3f3f46] data-[open=true]:hover:bg-[#27272a] min-h-[40px] data-[open=true]:rounded-b-none data-[open=true]:border-b-0",
                            value: "text-default-500 group-data-[has-value=true]:text-foreground",
                            label: "text-default-500 text-xs group-data-[filled=true]:-translate-y-0 group-data-[filled=true]:scale-100",
                            popoverContent: "bg-[#27272a] shadow-none border border-[#3f3f46] border-t-0 rounded-t-none -mt-[6px]",
                            listbox: "bg-[#27272a]",
                            listboxWrapper: "text-default-300"
                        }}
                        listboxProps={{
                            itemClasses: {
                                base: "data-[hover=true]:!bg-[#3f3f46] data-[focus=true]:!bg-[#3f3f46] data-[selectable=true]:focus:!bg-[#3f3f46] data-[hover=true]:text-white data-[focus=true]:text-white data-[selectable=true]:focus:text-white"
                            }
                        }}
                        popoverProps={{
                            className: "z-[50000]"
                        }}
                    >
                        {STATUSES.map((status) => (
                            <SelectItem key={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* Category Select */}
                    <Select
                        aria-label="Category"
                        placeholder="Category"
                        selectedKeys={filters.category ? [filters.category] : []}
                        onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as string;
                            updateURL({ category: value || null });
                        }}
                        size="sm"
                        classNames={{
                            base: "flex-1",
                            trigger: "bg-[#27272a] border-[#3f3f46] hover:bg-[#3f3f46] data-[open=true]:hover:bg-[#27272a] min-h-[40px] data-[open=true]:rounded-b-none data-[open=true]:border-b-0",
                            value: "text-default-500 group-data-[has-value=true]:text-foreground",
                            label: "text-default-500 text-xs group-data-[filled=true]:-translate-y-0 group-data-[filled=true]:scale-100",
                            popoverContent: "bg-[#27272a] shadow-none border border-[#3f3f46] border-t-0 rounded-t-none -mt-[6px]",
                            listbox: "bg-[#27272a]",
                            listboxWrapper: "text-default-300"
                        }}
                        listboxProps={{
                            itemClasses: {
                                base: "data-[hover=true]:!bg-[#3f3f46] data-[focus=true]:!bg-[#3f3f46] data-[selectable=true]:focus:!bg-[#3f3f46] data-[hover=true]:text-white data-[focus=true]:text-white data-[selectable=true]:focus:text-white"
                            }
                        }}
                        popoverProps={{
                            className: "z-[50000]"
                        }}
                    >
                        {CATEGORIES.map((category) => (
                            <SelectItem key={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </CardBody>
        </Card>
    );
};
