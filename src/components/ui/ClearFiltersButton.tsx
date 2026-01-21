import { Button } from "@heroui/react";

interface ClearFiltersButtonProps {
    onClear: () => void;
    label?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const ClearFiltersButton = ({
    onClear,
    label = "Clear All",
    size = "sm",
    className = ""
}: ClearFiltersButtonProps) => {
    return (
        <Button
            size={size}
            variant="ghost"
            color="default"
            className={`text-default-400 hover:text-default-500 min-w-0 ${className}`}
            onPress={onClear}
        >
            {label}
        </Button>
    );
};
