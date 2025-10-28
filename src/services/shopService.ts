import axios from 'axios';

const SHOP_API_URL = process.env.NEXT_PUBLIC_MANAGE_SHOP_API || 'https://shop.devnest.io.vn/api/shop';

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
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${SHOP_API_URL}?pageIndex=1&pageSize=100`, { 
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    },

    getShopById: async (shopId: string): Promise<Shop> => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${SHOP_API_URL}/${shopId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    },

    checkIfUserOwnsShop: async (userId: string): Promise<string | null> => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${SHOP_API_URL}?ownerId=${userId}&pageIndex=1&pageSize=1`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.data.totalItems > 0) {
            return response.data.data.items[0].id;
        } else {
            return null;
        }
    },

    createShop: async (payload: ShopCreationPayload): Promise<Shop> => {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(SHOP_API_URL, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data; 
    },
};
