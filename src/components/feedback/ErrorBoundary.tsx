import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card, CardBody } from '@heroui/react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
                    <Card className="max-w-lg w-full bg-content1 border border-danger/30 shadow-lg">
                        <CardBody className="flex flex-col items-center gap-6 py-8 px-6">
                            <div className="p-4 bg-danger/10 rounded-full">
                                <svg className="w-12 h-12 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h1 className="text-xl font-bold text-foreground mb-2">Something went wrong</h1>
                                <p className="text-default-500 text-sm">
                                    An unexpected error occurred. Please try reloading the page.
                                </p>
                            </div>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="w-full p-3 bg-danger/5 rounded-lg border border-danger/20 overflow-auto max-h-40">
                                    <p className="text-xs font-mono text-danger break-all">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <Button variant="flat" color="default" onPress={this.handleReset}>
                                    Try Again
                                </Button>
                                <Button color="danger" onPress={this.handleReload}>
                                    Reload Page
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
