import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { IncidentFilters } from "../../features/incidents/IncidentFilters";
import { useAppSelector } from "../../hooks";
import { selectFilters } from "../../features/incidents/incidentsSlice";
import { useURLSync } from "../../hooks/useURLSync";

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FilterDrawer = ({ isOpen, onClose }: FilterDrawerProps) => {
    const { clearURL } = useURLSync();
    const filters = useAppSelector(selectFilters);

    // Calculate active filter count
    const activeFilterCount = [
        filters.severities.length > 0,
        filters.status !== null,
        filters.category !== null,
        filters.search !== null,
    ].filter(Boolean).length;

    const handleClearAll = () => {
        clearURL();
        onClose();
    };

    const handleApply = () => {
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="full"
            scrollBehavior="inside"
            classNames={{
                base: "m-0 sm:m-0 bg-[#18181b]",
                wrapper: "items-end sm:items-end",
                body: "p-0 bg-[#18181b]",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 border-b border-[#3f3f46] bg-[#18181b]">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-lg font-bold text-default-300">Filters</h2>
                                {activeFilterCount > 0 && (
                                    <span className="text-sm text-default-500">
                                        ({activeFilterCount} active)
                                    </span>
                                )}
                            </div>
                        </ModalHeader>
                        <ModalBody className="bg-[#18181b]">
                            <IncidentFilters isInDrawer={true} />
                        </ModalBody>
                        <ModalFooter className="border-t border-[#3f3f46] bg-[#18181b]">
                            <Button
                                color="default"
                                variant="flat"
                                onPress={handleClearAll}
                                className="flex-1"
                            >
                                Clear All
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleApply}
                                className="flex-1"
                            >
                                Apply
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
