import { Card, CardBody } from "@heroui/react";

interface SummaryCardProps {
    title: string;
    count: number;
    color: "danger" | "warning" | "primary" | "default" | "success" | "secondary";
}

export const SummaryCard = ({ title, count, color }: SummaryCardProps) => {
    // Handle default color special case (needs -500 suffix for proper contrast)
    const colorClass = color === 'default' ? 'default-500' : color;

    return (
        <Card classNames={{ base: `border border-${colorClass} shadow-sm` }} className="bg-content1 dark:bg-content2 w-[110px] md:w-28 cursor-default flex-shrink-0" style={{ borderRadius: '5px' }}>
            <CardBody className="flex flex-row items-center justify-center py-1.5 md:py-2 px-2 md:px-3 gap-1.5 md:gap-2">
                <span className={`text-lg md:text-xl font-bold text-${colorClass}`}>{count}</span>
                <span className={`text-[0.65rem] md:text-xs font-semibold uppercase text-${colorClass}`}>{title}</span>
            </CardBody>
        </Card>
    );
};
