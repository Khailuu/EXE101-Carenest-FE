import axios, { AxiosResponse } from 'axios';
import { appointmentApi } from "@/constants/api"; 

// --- KHAI BÁO KIỂU DỮ LIỆU ---

export interface AppointmentDetail {
    serviceId: string;
    serviceName: string; 
    price: number;
    quantity: number;
}

// Kiểu dữ liệu cho một Cuộc hẹn (Appointment)
export interface Appointment {
    id: string; // ID Cuộc hẹn
    customerId: string;
    shopId: string;
    shopName: string; // Tên cửa hàng
    totalAmount: number; // Tổng tiền
    paymentMethod: 'shop' | 'online' | 'transfer';
    note: string | null;
    startTime: string; // Ví dụ: "2025-10-07T07:00:00Z"
    status: 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang tiến hành' | 'Hoàn thành' | 'Hủy bỏ' | 'Tranh chấp';
    staffName: string | null; // Tên nhân viên
    bankId: string | null;
    bankTransactionId: string | null;
    isPaid: boolean;
    details: AppointmentDetail[]; // Chi tiết dịch vụ/sản phẩm
}

// Kiểu dữ liệu cho Phản hồi API danh sách cuộc hẹn
export interface AppointmentListResponse {
    status: string;
    code: number;
    message: string;
    data: {
        items: Appointment[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}

// Kiểu dữ liệu cho Stats
export interface ServiceDetailStat {
    serviceDetailId: string;
    serviceDetailName: string;
    serviceId: string;
    serviceName: string;
    count: number;
    shopId: string | null;
    shopName: string | null;
}

export interface ServiceStat {
    serviceId: string;
    serviceName: string;
    count: number;
    shopId: string | null;
    shopName: string | null;
}

export interface ShopStat {
    shopId: string;
    shopName: string;
    count: number;
}

export interface AppointmentDashboardResponse {
    serviceDetailStats: ServiceDetailStat[];
    serviceStats: ServiceStat[];
    shopStats: ShopStat[] | null;
    shopId: string | null;
    shopName: string | null;
}


const APPOINTMENT_ENDPOINT = '/appointment';

export const appointmentService = {

    getAppointments: async (params: AppointmentQueryParams): Promise<AppointmentListResponse> => {
        
        const requestParams: Record<string, any> = {
            pageIndex: params.page || 1,
            pageSize: params.pageSize || 10,
            sortDirection: params.sortDirection || 'desc', 
        };

        if (params.search) requestParams.search = params.search;
        if (params.shopId) requestParams.shopId = params.shopId;
        if (params.status) requestParams.status = params.status;
        if (params.startDate) requestParams.startDate = params.startDate;
        if (params.endDate) requestParams.endDate = params.endDate;
        
        try {
            const response: AxiosResponse<AppointmentListResponse> = await appointmentApi.get(
                APPOINTMENT_ENDPOINT, 
                { params: requestParams } // Axios tự động chuyển đổi params thành query string
            );
            
            // Chuyển đổi status API thành kiểu hiển thị
            response.data.data.items = response.data.data.items.map(item => ({
                ...item,
                status: mapApiStatusToDisplay(item.status as any) 
            }));

            return response.data;

        } catch (error) {
            // Xử lý lỗi Axios (bao gồm lỗi 500, 401,...)
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error fetching appointments:", error.response.data);
                throw new Error(error.response.data.message || `API error with status ${error.response.status}`);
            }
            console.error("Unknown error fetching appointments:", error);
            throw new Error("An unexpected error occurred while fetching appointments.");
        }
    },

    getDashboardStats: async (shopId?: string): Promise<AppointmentDashboardResponse> => {
        try {
            const params: Record<string, any> = {};
            if (shopId) params.shopId = shopId;

            const response: AxiosResponse<{ success: boolean; message: string; data: AppointmentDashboardResponse }> = await appointmentApi.get(
                '/appointmentdetail/dashboard',
                { params }
            );

            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error fetching dashboard stats:", error.response.data);
                throw new Error(error.response.data.message || `API error with status ${error.response.status}`);
            }
            console.error("Unknown error fetching dashboard stats:", error);
            throw new Error("An unexpected error occurred while fetching dashboard stats.");
        }
    },

    mapApiStatusToDisplay: (apiStatus: string): Appointment['status'] => {
        switch (apiStatus) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'IN_PROGRESS':
                return 'Đang tiến hành';
            case 'COMPLETED':
                return 'Hoàn thành';
            case 'CANCELLED':
                return 'Hủy bỏ';
            case 'DISPUTED':
                return 'Tranh chấp';
            default:
                console.warn(`Unknown API status received: ${apiStatus}`);
                return 'Chờ xác nhận'; 
        }
    }
};

const mapApiStatusToDisplay = appointmentService.mapApiStatusToDisplay;
