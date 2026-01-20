import { Card, CardBody } from "@heroui/react";

interface SummaryCardProps {
    title: string;
    count: number;
    color: "danger" | "warning" | "primary" | "default" | "success" | "secondary";
}

export const SummaryCard = ({ title, count, color }: SummaryCardProps) => {
    const colorMap = {
        danger: "danger",
        warning: "warning",
        primary: "primary",
        success: "success",
        secondary: "secondary",
        default: "default-500"
    };
    const colorClass = colorMap[color] || "default-500";

    return (
        <Card classNames={{ base: `border border-${colorClass} shadow-sm` }} className="bg-content1 dark:bg-content2 w-28 cursor-default" style={{ borderRadius: '5px' }}>
            <CardBody className="flex flex-row items-center justify-center py-2 px-3 gap-2">
                <span className={`text-xl font-bold text-${colorClass}`}>{count}</span>
                <span className={`text-xs font-semibold uppercase text-${colorClass}`}>{title}</span>
            </CardBody>
        </Card>
    );
};
