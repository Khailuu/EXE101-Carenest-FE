import axios, {AxiosInstance, InternalAxiosRequestConfig, CreateAxiosDefaults } from 'axios';

// Lấy base URL cho API quản lý cửa hàng (cần được định nghĩa trong .env.local)
export const MANAGE_SHOPS_API = process.env.NEXT_PUBLIC_MANAGE_SHOPS_API;
const GATEWAY_BASE_URL = 'https://enormous-terrie-nghi-dna-dddc2780.koyeb.app/api';
const GATEWAY_BASE_URL_1 = 'https://carenestauthorize-production.up.railway.app/api';

// 1. Instance chung cho các API có yêu cầu Bearer Token (Đã đăng nhập)
export const apiInstance = {
    create: (configDefault?: CreateAxiosDefaults) => {
        const api = axios.create({
            // BaseURL tạm thời, sẽ bị ghi đè khi gọi create
            baseURL: GATEWAY_BASE_URL, 
            ...configDefault
        });
        api.interceptors.request.use((config) => {
            // Lấy token từ storage (ví dụ: cookie, localStorage)
            // LƯU Ý: CẦN CẬP NHẬT LOGIC LẤY TOKEN THỰC TẾ CỦA BẠN TẠI ĐÂY
            const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : "/* Lấy Bearer Token từ user session */";
            
            return {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${token}`, // Gắn Bearer Token
                },
            } as InternalAxiosRequestConfig;
        }, (error) => Promise.reject(error)); // Xử lý lỗi trong request
        return api;
    },
};

// 2. Instance API không cần Bearer Token
export const shopsApi: AxiosInstance = axios.create({
  baseURL: GATEWAY_BASE_URL, 
});
export const shopsApi1: AxiosInstance = axios.create({
  baseURL: GATEWAY_BASE_URL, 
});

// Auth service API roots (prefer env, fallback to production)
const AUTH_ROOT = process.env.NEXT_PUBLIC_MANAGE_REVIEW_URL ?? "https://exotic-rosene-nghi-dna-e732b270.koyeb.app";
const AUTH_API = `${AUTH_ROOT}/api/auth`;
const API_ROOT = `${AUTH_ROOT}/api`;

// Public auth endpoints (/api/auth/...)
export const authApi: AxiosInstance = axios.create({ baseURL: AUTH_API });

// Secured auth endpoints (/api/auth/...) that need Bearer token
export const authApiSecured: AxiosInstance = axios.create({ baseURL: AUTH_API });
authApiSecured.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
        if (token) {
            config.headers = {
                ...(config.headers || {}),
                Authorization: `Bearer ${token}`,
            } as any;
        }
        return config as InternalAxiosRequestConfig;
    },
    (error) => Promise.reject(error)
);

// Secured general API root (/api/...) for admin endpoints
export const apiSecured: AxiosInstance = axios.create({ baseURL: API_ROOT });
apiSecured.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
        if (token) {
            config.headers = {
                ...(config.headers || {}),
                Authorization: `Bearer ${token}`,
            } as any;
        }
        return config as InternalAxiosRequestConfig;
    },
    (error) => Promise.reject(error)
);

export const registrationApi = axios.create({
    baseURL: GATEWAY_BASE_URL,
});

// 3. Instance cho Appointment API (CẦN Bearer Token)
export const appointmentApi: AxiosInstance = apiInstance.create({
    baseURL: GATEWAY_BASE_URL,
});
