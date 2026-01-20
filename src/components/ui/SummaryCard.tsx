import { Card, CardBody } from "@heroui/react";

interface SummaryCardProps {
    title: string;
    count: number;
    color: "danger" | "warning" | "primary" | "default" | "success" | "secondary";
}

export const SummaryCard = ({ title, count, color }: SummaryCardProps) => (
    <Card classNames={{ base: "border-none shadow-sm" }} className="bg-content1 dark:bg-content2 w-28 cursor-pointer hover:bg-content2 transition-colors" style={{ borderRadius: '5px' }}>
        <CardBody className="flex flex-row items-center justify-center py-2 px-3 gap-2">
            <span className={`text-xl font-bold ${color === 'danger' ? 'text-danger' :
                color === 'warning' ? 'text-warning' :
                    color === 'primary' ? 'text-primary' :
                        color === 'success' ? 'text-success' :
                            color === 'secondary' ? 'text-secondary' :
                                'text-default-500'
                }`}>{count}</span>
            <span className="text-xs font-semibold uppercase text-default-500">{title}</span>
        </CardBody>
    </Card>
);
