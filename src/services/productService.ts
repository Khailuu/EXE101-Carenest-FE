// src/services/productService.ts

interface ApiResponse<T> { items: T[]; totalItems: number; }

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

const BASE_PRODUCT_API_URL = "https://product.devnest.io.vn/api/product"; // Giả định URL API

export const productService = {
    /**
     * Lấy danh sách Sản phẩm theo shopId.
     * @param shopId ID của cửa hàng.
     */
    getProducts: async (shopId: string): Promise<ApiResponse<ProductApiData>> => {
        const pageIndex = 1;
        const pageSize = 100; // Lấy đủ lớn để có tất cả
        const sortDirection = "asc";
        const url = `${BASE_PRODUCT_API_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&shopId=${shopId}`;

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
            return result.data as ApiResponse<ProductApiData>;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Tạo mới Sản phẩm (POST)
     */
    createProduct: async (data: CreateProductRequest): Promise<ProductApiData> => {
        const url = BASE_PRODUCT_API_URL;
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
            const token = localStorage.getItem("authToken");
            const headers: HeadersInit = { Accept: "*/*" };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: "POST",
                headers,
                body: formData,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Lỗi HTTP: ${response.status} - ${errorBody}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(`Lỗi API: ${result.message}`);
            }
            return result.data as ProductApiData;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Cập nhật Sản phẩm (PUT)
     */
    updateProduct: async (productId: string, data: UpdateProductRequest): Promise<ProductApiData> => {
        const url = `${BASE_PRODUCT_API_URL}/${productId}`;
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
            const token = localStorage.getItem("authToken");
            const headers: HeadersInit = { Accept: "*/*" };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: "PUT",
                headers,
                body: formData,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Lỗi HTTP: ${response.status} - ${errorBody}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(`Lỗi API: ${result.message}`);
            }
            return result.data as ProductApiData;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Xóa một Sản phẩm (DELETE)
     */
    deleteProduct: async (productId: string): Promise<void> => {
        const url = `${BASE_PRODUCT_API_URL}/${productId}`;

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