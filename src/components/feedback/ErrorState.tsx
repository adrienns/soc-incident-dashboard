import { Card, CardBody, Button } from "@heroui/react";

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
    return (
        <div className="flex justify-center items-center h-screen bg-background text-foreground">
            <Card className="max-w-md bg-danger-50">
                <CardBody>
                    <p className="text-danger">Error: {message}</p>
                    <Button className="mt-4" onPress={onRetry}>
                        Retry
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
};
