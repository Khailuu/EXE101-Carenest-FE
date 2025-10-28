interface ApiResponse<T> {
    items: T[];
    totalItems: number;
}

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

const BASE_PRODUCT_CATEGORY_API_URL = "https://product.devnest.io.vn/api/ProductCategories";

export const productCategoryService = {
    getProductCategories: async (shopId: string): Promise<ApiResponse<ProductCategoryApiData>> => {
        const pageIndex = 1;
        const pageSize = 100;
        const sortDirection = "asc";
        const url = `${BASE_PRODUCT_CATEGORY_API_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&shopId=${shopId}`;

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
            return result.data as ApiResponse<ProductCategoryApiData>;
        } catch (error) {
            throw error;
        }
    },

    createProductCategory: async (data: CreateProductCategoryRequest): Promise<ProductCategoryApiData> => {
        const url = `${BASE_PRODUCT_CATEGORY_API_URL}/shops/${data.shopId}`;
        try {
            const token = localStorage.getItem("authToken");
            const headers: HeadersInit = { "Content-Type": "application/json" };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify({ name: data.name }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Lỗi HTTP: ${response.status} - ${errorBody}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(`Lỗi API: ${result.message}`);
            }
            return result.data as ProductCategoryApiData;
        } catch (error) {
            throw error;
        }
    },

    updateProductCategory: async (categoryId: string, data: UpdateProductCategoryRequest): Promise<ProductCategoryApiData> => {
        const url = `${BASE_PRODUCT_CATEGORY_API_URL}/${categoryId}`;
        try {
            const token = localStorage.getItem("authToken");
            const headers: HeadersInit = { "Content-Type": "application/json" };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: "PUT",
                headers,
                body: JSON.stringify({ name: data.name }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Lỗi HTTP: ${response.status} - ${errorBody}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(`Lỗi API: ${result.message}`);
            }
            return result.data as ProductCategoryApiData;
        } catch (error) {
            throw error;
        }
    },

    deleteProductCategory: async (categoryId: string): Promise<void> => {
        const url = `${BASE_PRODUCT_CATEGORY_API_URL}/${categoryId}`;
        try {
            const token = localStorage.getItem("authToken");
            const headers: HeadersInit = { Accept: "*/*" };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: "DELETE",
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
        } catch (error) {
            throw error;
        }
    },
};
