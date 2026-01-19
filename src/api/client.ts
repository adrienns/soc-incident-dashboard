import axios from 'axios';

// Base URL is empty to use the Vite proxy (avoids CORS)
const BASE_URL = '';

export const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // backend stores refresh tokens in cookies
    withCredentials: true,
});

client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => response,
    (error) => {
        // TODO: Handle 401s for token refresh
        return Promise.reject(error);
    }
);
