import { Input } from "@heroui/react";

interface SearchBarProps {
    value: string;
    onChange: (value: string | null) => void;
    placeholder?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const SearchBar = ({
    value,
    onChange,
    placeholder = "Search by Source IP",
    size = "lg",
    className = ""
}: SearchBarProps) => {
    return (
        <Input
            placeholder={placeholder}
            value={value}
            onValueChange={onChange}
            size={size}
            isClearable
            onClear={() => onChange(null)}
            className={className}
            classNames={{
                inputWrapper: "bg-[#27272a] hover:bg-[#3f3f46] group-data-[focus=true]:bg-[#3f3f46] border border-[#3f3f46]",
                input: "text-default-300"
            }}
            endContent={
                <svg className="w-4 h-4 text-default-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            }
        />
    );
};
