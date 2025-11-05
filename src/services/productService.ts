// src/services/productService.ts

import { apiInstance } from "@/constants/api";

const PRODUCT_BASE_URL =
  process.env.NEXT_PUBLIC_MANAGE_PRODUCT_URL ||
  "https://persistent-nissy-nghi-dna-ac3fa53e.koyeb.app/api/";
const productApi = apiInstance.create({ baseURL: PRODUCT_BASE_URL });

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
  productName: string;
  description: string;
  status: boolean;
  imgUrls?: string; // chuỗi JSON mảng URL ảnh
}

// Tránh lặp đường dẫn nếu baseURL đã chứa "/Products"
const PRODUCTS_PATH = /\/Products\/?$/i.test(
  (PRODUCT_BASE_URL || "").replace(/\s+/g, "")
)
  ? ""
  : "Products";
const BASE_PRODUCT_API_URL = PRODUCTS_PATH;

export const productService = {
  /**
   * Lấy danh sách Sản phẩm theo shopId.
   * @param shopId ID của cửa hàng.
   */
  getProductsByCategory: async (
    productCategoryId: string
  ): Promise<ProductApiData[]> => {
    const pageIndex = 1;
    const pageSize = 100;
    const sortDirection = "asc";

    try {
      const response = await productApi.get(BASE_PRODUCT_API_URL, {
        params: { pageIndex, pageSize, sortDirection, productCategoryId },
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Tạo mới Sản phẩm (POST)
   */
  createProduct: async (
    data: CreateProductRequest
  ): Promise<ProductApiData> => {
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
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật Sản phẩm (PUT)
   */
  updateProduct: async (
    productId: string,
    data: UpdateProductRequest
  ): Promise<ProductApiData> => {
    try {
      const response = await productApi.put(
        `${BASE_PRODUCT_API_URL}/${productId}`,
        {
          productName: data.productName,
          description: data.description,
          status: data.status,
          imgUrls: data.imgUrls ?? "[]",
        }
      );
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
      const response = await productApi.delete(
        `${BASE_PRODUCT_API_URL}/${productId}`
      );

      // No return data for delete
    } catch (error) {
      throw error;
    }
  },
};
// Thêm vào productService.ts nếu chưa có:
// Sử dụng đúng trường productName trả về từ API bạn đã show ở ảnh!
// Trong productService.ts hoặc file chứa API
export const getAllProductsForSelect = async (shopId: string) => {
  const pageIndex = 1;
  const pageSize = 100;
  const sortDirection = "asc";
  try {
    // Nếu backend filter, phải có tham số shopId gửi đi
    const response = await productApi.get(BASE_PRODUCT_API_URL, {
      params: { pageIndex, pageSize, sortDirection, shopId }
    });
    // Sử dụng productName làm label để autocomplete hiển thị đúng tên sản phẩm
    return (response.data.data?.items ?? []).map((item: any) => ({
      label: item.productName,
      value: item.id,
    }));
  } catch (error) {
    throw error;
  }
};

