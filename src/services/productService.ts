// src/services/productService.ts

import { apiInstance } from '@/constants/api';

const productApi = apiInstance.create({ baseURL: 'https://gateway.devnest.io.vn' });

export interface ProductApiData {
    id: string;
    name: string;
    stock: number;
    price: number;
    discount: number;
    image: string;
    description: string;
    status: "Hoạt động" | "Ngưng hoạt động";
    productCategoryId: string; 
    shopId: string;
}

interface CreateProductRequest {
    name: string;
    stock: number;
    price: number;
    discount: number;
    description: string;
    status: boolean; // API yêu cầu boolean
    productCategoryId: string;
    shopId: string;
    imageFile: File | null;
}

interface UpdateProductRequest {
    name?: string;
    stock?: number;
    price?: number;
    discount?: number;
    description?: string;
    status?: boolean;
    productCategoryId?: string;
    imageFile?: File | null;
}

const BASE_PRODUCT_API_URL = "/product/api/product"; // Giả định URL API

export const productService = {
    /**
     * Lấy danh sách Sản phẩm theo shopId.
     * @param shopId ID của cửa hàng.
     */
    getProducts: async (shopId: string): Promise<ApiResponse<ProductApiData>> => {
        const pageIndex = 1;
        const pageSize = 100;
        const sortDirection = "asc";

        try {
            const response = await productApi.get(BASE_PRODUCT_API_URL, {
                params: { pageIndex, pageSize, sortDirection, shopId }
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Tạo mới Sản phẩm (POST)
     */
    createProduct: async (data: CreateProductRequest): Promise<ProductApiData> => {
        const formData = new FormData();

        formData.append("Name", data.name);
        formData.append("Stock", data.stock.toString());
        formData.append("Price", data.price.toString());
        formData.append("Discount", data.discount.toString());
        formData.append("Description", data.description);
        formData.append("Status", data.status ? "true" : "false");
        formData.append("ProductCategoryId", data.productCategoryId);
        formData.append("ShopId", data.shopId);

        if (data.imageFile) {
            formData.append("ImageFile", data.imageFile);
        }

        try {
            const response = await productApi.post(BASE_PRODUCT_API_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Cập nhật Sản phẩm (PUT)
     */
    updateProduct: async (productId: string, data: UpdateProductRequest): Promise<ProductApiData> => {
        const formData = new FormData();

        if (data.name !== undefined) formData.append("Name", data.name);
        if (data.stock !== undefined) formData.append("Stock", data.stock.toString());
        if (data.price !== undefined) formData.append("Price", data.price.toString());
        if (data.discount !== undefined) formData.append("Discount", data.discount.toString());
        if (data.description !== undefined) formData.append("Description", data.description);
        if (data.status !== undefined) formData.append("Status", data.status ? "true" : "false");
        if (data.productCategoryId !== undefined) formData.append("ProductCategoryId", data.productCategoryId);
        if (data.imageFile) formData.append("ImageFile", data.imageFile);

        try {
            const response = await productApi.put(`${BASE_PRODUCT_API_URL}/${productId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Xóa một Sản phẩm (DELETE)
     */
    deleteProduct: async (productId: string): Promise<void> => {
        try {
            const response = await productApi.delete(`${BASE_PRODUCT_API_URL}/${productId}`);

            // No return data for delete
        } catch (error) {
            throw error;
        }
    },
};