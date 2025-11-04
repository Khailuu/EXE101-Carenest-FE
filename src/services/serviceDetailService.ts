
import { apiInstance } from '@/constants/api';

const serviceDetailApi = apiInstance.create();

interface ServiceDetailApiData {
    id: string;
    name: string;
    serviceId: string;
    price: number;
    durationTime: string;
    status: 'Hoạt động' | 'Ngưng hoạt động';
}

const BASE_SERVICE_DETAIL_API_URL = "/service-detail/api/servicedetail";

export const serviceDetailService = {
    getServiceDetails: async (shopId: string): Promise<ApiResponse<ServiceDetailApiData>> => {
        const pageIndex = 1;
        const pageSize = 100;
        const sortDirection = "asc";

        try {
            const response = await serviceDetailApi.get(BASE_SERVICE_DETAIL_API_URL, {
                params: { pageIndex, pageSize, sortDirection, shopId }
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    getServiceDetailsByServiceId: async (serviceId: string): Promise<ApiResponse<ServiceDetailApiData>> => {
        const pageIndex = 1;
        const pageSize = 10;
        const sortDirection = "asc";

        try {
            const response = await serviceDetailApi.get(BASE_SERVICE_DETAIL_API_URL, {
                params: { pageIndex, pageSize, sortDirection, serviceId }
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },
};