import { apiInstance } from '@/constants/api';

const shopApi = apiInstance.create({ baseURL: 'https://enormous-terrie-nghi-dna-dddc2780.koyeb.app/api' });
const orderApi = apiInstance.create({ baseURL: 'https://wispy-shani-nghi-dna-ef3107ba.koyeb.app/api' });

const SHOP_API_URL = '/shop';

export interface Shop {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    status: number;
    imgUrl: string;
    workingDays: string;
}

interface ShopListResponse {
    items: Shop[];
    totalItems: number;
    currentPage: number;
    pageSize: number;
}

interface ShopCreationPayload {
    ownerId: string;
    name: string;
    description: string;
    status: number;
    imgUrl: string;
    workingDays: string;
}

// Order Dashboard interfaces
interface OrderItem {
    orderId: string;
    createdAt: string;
    orderCode: string | null;
    orderDetailCount: number;
}

interface ShopOrderStats {
    shopId: string;
    shopName: string;
    totalOrders: number;
    totalOrderDetails: number;
    totalOrdersCompleted: number;
    totalOrdersCancelled: number;
    totalSeller: number;
    totalRevenue: number;
    ordersTotal: number;
    orders: OrderItem[];
}

interface OrderDashboardResponse {
    shops: any;
    shopDetail: {
        details: {
            items: orderItems[],
            pageNumber: number,
            pageSize: number,
            totalItems: number,
            totalPages: number
        },
            reviewCount: number,
            shopId: string,
            shopName: string,
            totalOrderDetails: number,
            totalOrders: number,
            totalOrdersCancelled: number,
            totalOrdersCompleted: number,
            totalRevenue: number,
            totalSeller: number
    };
    reviewCount: number;
}

interface orderItems {
    createdAt: null;
    id: string;
    imgUrls: null;
    isDefault: boolean;
    orderId: string;
    price: number;
    productDetailId: string;
    productName: string;
    productStatus: boolean;
    quantity: number;
    totalAmount: number;
}

// Order List API interfaces
interface Order {
    id: string;
    customerId: string;
    shopId: string;
    shipAddressId: string;
    totalAmount: number;
    paymentMethod: string;
    note: string;
    status: number;
    bankId: string | null;
    bankTransactionId: string | null;
    isPaid: boolean;
    createdAt: string;
}

interface OrderListResponse {
    items: Order[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

interface OrderDetail {
    id: string;
    productDetailId: string;
    orderId: string;
    quantity: number;
    totalAmount: number;
    name?: string;
}

interface OrderDetailResponse {
    items: OrderDetail[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

const orderDetailApi = apiInstance.create({ baseURL: 'https://empirical-chrysler-nghi-dna-dbcd2310.koyeb.app/api' });

export const shopService = {
    getShops: async (): Promise<ShopListResponse> => {
        const response = await shopApi.get(`${SHOP_API_URL}?pageIndex=1&pageSize=100`);
        return response.data.data;
    },

    getShopById: async (shopId: string): Promise<Shop> => {
        const response = await shopApi.get(`${SHOP_API_URL}/${shopId}`);
        return response.data.data;
    },

    checkIfUserOwnsShop: async (userId: string): Promise<string | null> => {
        const response = await shopApi.get(`${SHOP_API_URL}?ownerId=${userId}&pageIndex=1&pageSize=1`);
        if (response.data.data.totalItems > 0) {
            return response.data.data.items[0].id;
        } else {
            return null;
        }
    },

    createShop: async (payload: ShopCreationPayload): Promise<Shop> => {
        const response = await shopApi.post(SHOP_API_URL, payload);
        return response.data.data; 
    },

    getOrderDashboard: async (shopId: string, filters?: {
        pageIndex?: number,
        pageSize?: number,
        sortBy?: string,
        sortDirection?: string,
        ordersLimit?: number,
        ordersSortBy?: string,
        ordersSortDirection?: string,
        orderId?: string
    }): Promise<OrderDashboardResponse> => {
        const response = await orderApi.get('/Order/dashboard', {
            params: {
                shopId,
                pageIndex: filters?.pageIndex || 1,
                pageSize: filters?.pageSize || 10,
                sortDirection: filters?.sortDirection || 'asc',
                sortBy: filters?.sortBy || 'createdAt',
                ordersLimit: filters?.ordersLimit || 5,
                ordersSortBy: filters?.ordersSortBy || 'createdAt',
                ordersSortDirection: filters?.ordersSortDirection || 'desc',
                ...(filters?.orderId && { orderId: filters.orderId })
            }
        });
        return response.data.data;
    },

    getOrders: async (shopId: string, filters?: {
        pageIndex?: number,
        pageSize?: number,
        sortDirection?: string
    }): Promise<OrderListResponse> => {
        const response = await orderApi.get('/Order', {
            params: {
                shopId,
                pageIndex: filters?.pageIndex || 1,
                pageSize: filters?.pageSize || 10,
                sortDirection: filters?.sortDirection || 'asc'
            }
        });
        return response.data.data;
    },

    getOrderDetails: async (orderId: string, filters?: {
        pageIndex?: number,
        pageSize?: number,
        sortDirection?: string
    }): Promise<OrderDetailResponse> => {
        const response = await orderDetailApi.get('/OrderDetail', {
            params: {
                orderId,
                pageIndex: filters?.pageIndex || 1,
                pageSize: filters?.pageSize || 10,
                sortDirection: filters?.sortDirection || 'asc'
            }
        });
        return response.data.data;
    },
};
