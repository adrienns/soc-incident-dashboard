import { Select, SelectItem } from '@heroui/react';
import type { SharedSelection } from '@heroui/react';
import type { ReactNode } from 'react';

export interface DropdownOption {
    key: string;
    label: string;
    renderLabel?: ReactNode;
}

interface DropdownProps {
    label: string;
    placeholder: string;
    options: DropdownOption[];
    selectedKeys: Set<string>;
    onSelectionChange: (keys: SharedSelection) => void;
    selectionMode?: 'single' | 'multiple';
    className?: string;
}

export const Dropdown = ({
    label,
    placeholder,
    options,
    selectedKeys,
    onSelectionChange,
    selectionMode = 'single',
    className = 'w-full sm:w-48',
}: DropdownProps) => {
    return (
        <Select
            label={label}
            placeholder={placeholder}
            selectionMode={selectionMode}
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
            className={className}
            size="sm"
        >
            {options.map((option) => (
                <SelectItem key={option.key} textValue={option.label}>
                    {option.renderLabel ?? option.label}
                </SelectItem>
            ))}
        </Select>
    );
};
