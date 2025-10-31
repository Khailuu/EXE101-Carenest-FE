import { apiInstance } from '@/constants/api';

const shopApi = apiInstance.create({ baseURL: 'https://gateway.devnest.io.vn' });

const SHOP_API_URL = '/shop';

interface Shop {
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
};
