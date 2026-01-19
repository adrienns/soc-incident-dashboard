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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex gap-3 justify-center py-6">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            SOC Dashboard
                        </h1>
                        <p className="text-small text-default-500">Incident Management System</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-8 py-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <Input
                            isRequired
                            label="Username"
                            placeholder="Enter your username"
                            value={username}
                            onValueChange={setUsername}
                            variant="bordered"
                        />
                        <Input
                            isRequired
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onValueChange={setPassword}
                            variant="bordered"
                        />

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        <Button
                            color="primary"
                            type="submit"
                            className="w-full"
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
