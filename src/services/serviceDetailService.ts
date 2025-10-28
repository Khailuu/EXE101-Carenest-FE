
interface ApiResponse<T> { items: T[]; totalItems: number; }

interface ServiceDetailApiData {
    id: string;
    name: string;
    serviceId: string;
    price: number;
    durationTime: string;
    status: 'Hoạt động' | 'Ngưng hoạt động';
}

const BASE_SERVICE_DETAIL_API_URL = "https://services-detail.devnest.io.vn/api/servicedetail";

export const serviceDetailService = {
    getServiceDetails: async (shopId: string): Promise<ApiResponse<ServiceDetailApiData>> => {
        const pageIndex = 1;
        const pageSize = 100;
        const sortDirection = "asc";
        const url = `${BASE_SERVICE_DETAIL_API_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&shopId=${shopId}`;

        try {
            const token = localStorage.getItem("authToken");
            const headers: HeadersInit = { Accept: "*/*" };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, { method: "GET", headers });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Lỗi HTTP: ${response.status} - ${errorBody}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(`Lỗi API: ${result.message}`);
            }
            return result.data as ApiResponse<ServiceDetailApiData>;
        } catch (error) {
            throw error;
        }
    },

    getServiceDetailsByServiceId: async (serviceId: string): Promise<ApiResponse<ServiceDetailApiData>> => {
        const pageIndex = 1;
        const pageSize = 10;
        const sortDirection = "asc";
        const url = `${BASE_SERVICE_DETAIL_API_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&serviceId=${serviceId}`;

        try {
            const token = localStorage.getItem("authToken");
            const headers: HeadersInit = { Accept: "*/*" };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Lỗi HTTP: ${response.status} - ${errorBody}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(`Lỗi API: ${result.message}`);
            }

            return result.data as ApiResponse<ServiceDetailApiData>;
        } catch (error) {
            throw error;
        }
    },
};