import { AxiosResponse } from 'axios';
import { apiInstance } from "@/constants/api";

const userApi = apiInstance.create({
    baseURL: process.env.NEXT_PUBLIC_GATEWAY_BASE_URL || 'https://gateway.devnest.io.vn',
});

export const userService = {
    getUserCount: async (): Promise<number> => {
        const response: AxiosResponse = await userApi.get('/admin/accounts/count');
        return response.data.data; // API trả về data: 5
    },
};