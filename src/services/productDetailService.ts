import { apiInstance } from "@/constants/api";

const PRODUCT_DETAIL_BASE_URL = process.env.NEXT_PUBLIC_MANAGE_PRODUCT_DETAIL_URL || 
  "https://persistent-nissy-nghi-dna-ac3fa53e.koyeb.app/api/ProductDetails";
const productDetailApi = apiInstance.create({ baseURL: PRODUCT_DETAIL_BASE_URL });

export interface ProductDetailData {
  id?: string;
  name: string;
  price: number;
  status: boolean;
  discount: number;
  isDefault: boolean;
  imgUrls: string;
  quantityInStock: number;
}

export const productDetailService = {
  getProductDetailsByProductId: async (productId: string) => {
    const res = await productDetailApi.get("/", {
      // Bust browser/proxy cache to guarantee fresh data after updates
      params: { pageIndex: 1, pageSize: 100, sortDirection: "asc", productId, _ts: Date.now() },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return res.data.data?.items ?? [];
  },
  
  createProductDetail: async (productId: string, data: ProductDetailData) => {
    // Swagger: POST /api/ProductDetails/products/{productId}
    const res = await productDetailApi.post(`/products/${productId}`, {
      name: data.name,
      price: data.price,
      status: data.status,
      discount: data.discount,
      isDefault: data.isDefault,
      imgUrls: data.imgUrls,
      quantityInStock: data.quantityInStock,
    });
    return res.data.data;
  },

  updateProductDetail: async (id: string, data: ProductDetailData) => {
    const res = await productDetailApi.put(`/${id}`, data);
    return res.data.data;
  },

  deleteProductDetail: async (id: string) => {
    await productDetailApi.delete(`/${id}`);
  },
};
