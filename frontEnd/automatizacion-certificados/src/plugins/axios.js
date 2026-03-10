import axios from "axios";
import { useAuthStore } from "../store/auth.js";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000', // Adaptado a un fallback local
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para añadir el header x-token en cada petición
axiosInstance.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token) {
            config.headers["x-token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosInstance;
