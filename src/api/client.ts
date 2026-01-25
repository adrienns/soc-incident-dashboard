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
    timeout: 30000, // 30 second timeout
});

client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        // Validate token before sending request
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add security headers for defense-in-depth
        config.headers['X-Content-Type-Options'] = 'nosniff';
        config.headers['X-Frame-Options'] = 'DENY';
        config.headers['X-XSS-Protection'] = '1; mode=block';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const setupInterceptors = (store: any) => {
    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Skip if it's the refresh request itself to avoid infinite loops/deadlocks
            if (originalRequest.url?.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return client(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Try to refresh the token
                    // API requires the old access token in the body
                    const currentToken = localStorage.getItem('token');
                    const response = await client.post('/api/auth/refresh', {
                        accessToken: currentToken
                    });
                    const { accessToken } = response.data;

                    store.dispatch({ type: 'auth/tokenReceived', payload: accessToken });

                    processQueue(null, accessToken);
                    isRefreshing = false;

                    originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                    return client(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    isRefreshing = false;
                    store.dispatch({ type: 'auth/logout' });
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );
};
