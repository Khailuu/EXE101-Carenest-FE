import { apiInstance } from '@/constants/api';

const productCategoryApi = apiInstance.create();

export interface ProductCategoryApiData {
    id: string;
    name: string;
    shopId: string;
    status: "Hoạt động" | "Ngưng hoạt động";
}

interface CreateProductCategoryRequest {
    name: string;
    shopId: string;
}

interface UpdateProductCategoryRequest {
    name: string;
}

const BASE_PRODUCT_CATEGORY_API_URL = "ProductCategories";

export const productCategoryService = {
    getProductCategories: async (shopId: string): Promise<ApiResponse<ProductCategoryApiData>> => {
        const pageIndex = 1;
        const pageSize = 100;
        const sortDirection = "asc";

        try {
            const response = await productCategoryApi.get(BASE_PRODUCT_CATEGORY_API_URL, {
                params: { pageIndex, pageSize, sortDirection, shopId }
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    createProductCategory: async (data: CreateProductCategoryRequest): Promise<ProductCategoryApiData> => {
        try {
            const response = await productCategoryApi.post(`${BASE_PRODUCT_CATEGORY_API_URL}/shops/${data.shopId}`, {
                name: data.name
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    updateProductCategory: async (categoryId: string, data: UpdateProductCategoryRequest): Promise<ProductCategoryApiData> => {
        try {
            const response = await productCategoryApi.put(`${BASE_PRODUCT_CATEGORY_API_URL}/${categoryId}`, {
                name: data.name
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    deleteProductCategory: async (categoryId: string): Promise<void> => {
        try {
            const response = await productCategoryApi.delete(`${BASE_PRODUCT_CATEGORY_API_URL}/${categoryId}`);

            // No return data for delete
        } catch (error) {
            throw error;
        }
    },
};
