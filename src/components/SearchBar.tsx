import { Input } from '@heroui/react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
    className?: string;
}

export const SearchBar = ({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    className = 'w-full sm:w-64',
}: SearchBarProps) => {
    return (
        <Input
            placeholder={placeholder}
            value={value}
            onValueChange={onChange}
            className={className}
            size="sm"
            isClearable
            onClear={onClear}
        />
    );
};
