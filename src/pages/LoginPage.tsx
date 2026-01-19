import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Divider,
} from "@heroui/react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { login } from "../features/auth/authSlice";

export default function LoginPage() {
    const [username, setUsername] = useState("analyst");
    const [password, setPassword] = useState("s3cur3");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ username, password }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
            <Card className="w-full max-w-md bg-content1 border-default-200 border-1 shadow-lg">
                <CardHeader className="flex gap-3 justify-center py-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-danger/10 rounded-full mb-2">
                            <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">
                            SOC Dashboard
                        </h1>
                        <p className="text-small text-default-500">Incident Management System</p>
                    </div>
                </CardHeader>
                <Divider className="my-2" />
                <CardBody className="px-8 py-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <Input
                            isRequired
                            label="Username"
                            placeholder="Enter your username"
                            value={username}
                            onValueChange={setUsername}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-1"
                            }}
                        />
                        <Input
                            isRequired
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onValueChange={setPassword}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-1"
                            }}
                        />

                        {error && (
                            <div className="p-3 text-sm text-danger bg-danger/10 rounded-lg border border-danger/20">
                                {error}
                            </div>
                        )}

                        <Button
                            color="danger"
                            type="submit"
                            className="w-full font-semibold shadow-md"
                            isLoading={status === 'loading'}
                        >
                            Sign In
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
