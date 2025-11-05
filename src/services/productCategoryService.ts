import { apiInstance } from '@/constants/api';

const PRODUCT_CATEGORY_BASE_URL = process.env.NEXT_PUBLIC_MANAGE_CATEGORY_PRODUCT_URL || 'https://persistent-nissy-nghi-dna-ac3fa53e.koyeb.app/api/';
const productCategoryApi = apiInstance.create({ baseURL: PRODUCT_CATEGORY_BASE_URL });

// Nếu baseURL đã kết thúc bằng "/ProductCategories" thì không cần thêm lại lần nữa
const PRODUCT_CATEGORIES_PATH = /\/ProductCategories\/?$/i.test(
    (PRODUCT_CATEGORY_BASE_URL || '').replace(/\s+/g, '')
) ? '' : 'ProductCategories';

export interface ProductCategoryApiData {
    id: string;
    name: string;
    shopId: string;
    status: "Hoạt động" | "Ngưng hoạt động";
}

interface ApiDataWrapper<T> {
    items: T[];
    totalItems: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface CreateProductCategoryRequest {
    name: string;
    shopId: string;
}

interface UpdateProductCategoryRequest {
    name: string;
}

const BASE_PRODUCT_CATEGORY_API_URL = PRODUCT_CATEGORIES_PATH; 

export const productCategoryService = {
    getProductCategories: async (shopId: string): Promise<ApiDataWrapper<ProductCategoryApiData>> => {
        const pageIndex = 1;
        const pageSize = 1000; // tăng để đảm bảo autocomplete có đủ danh mục
        const sortDirection = "asc";

        try {
            const response = await productCategoryApi.get(BASE_PRODUCT_CATEGORY_API_URL, {
                params: { pageIndex, pageSize, sortDirection, shopId }
            });

            return response.data.data as ApiDataWrapper<ProductCategoryApiData>;
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
