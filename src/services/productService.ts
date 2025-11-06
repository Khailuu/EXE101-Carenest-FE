import { apiInstance } from "@/constants/api";

// === PRODUCT ===
const ENV_PRODUCT_URL = process.env.NEXT_PUBLIC_MANAGE_PRODUCT_URL;
const PRODUCT_BASE_URL = (ENV_PRODUCT_URL && ENV_PRODUCT_URL.trim().length > 0)
  ? ENV_PRODUCT_URL.trim()
  : "https://persistent-nissy-nghi-dna-ac3fa53e.koyeb.app/api/Products";
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

export interface CreateProductRequest {
  productName: string;
  description: string;
  status: boolean;
  productCategoryId: string;
  imageFile: File | null;
}

interface UpdateProductRequest {
  productName: string;
  description: string;
  status: boolean;
  imgUrls?: string;
}

export const productService = {
  getProductById: async (productId: string): Promise<any> => {
    const res = await productApi.get(`/${productId}`);
    return res.data.data;
  },
  getProductsByCategory: async (productCategoryId: string): Promise<any> => {
    const pageIndex = 1,
      pageSize = 100,
      sortDirection = "asc";
    const res = await productApi.get("/", { params: { pageIndex, pageSize, sortDirection, productCategoryId } });
    return res.data.data;
  },

  createProduct: async (data: CreateProductRequest): Promise<ProductApiData> => {
    const formData = new FormData();
    formData.append("ProductCategoryId", data.productCategoryId);
    formData.append("ProductName", data.productName);
    formData.append("Description", data.description || "");
    formData.append("Status", String(data.status));
    if (data.imageFile) formData.append("ImageFile", data.imageFile);
    const res = await productApi.post("/", formData);
    return res.data.data;
  },

  updateProduct: async (productId: string, data: UpdateProductRequest): Promise<ProductApiData> => {
    const res = await productApi.put(`/${productId}`, {
      productName: data.productName,
      description: data.description,
      status: data.status,
      imgUrls: data.imgUrls ?? "[]",
    });
    return res.data.data;
  },

  deleteProduct: async (productId: string): Promise<void> => {
    await productApi.delete(`/${productId}`);
  },
};

export const getAllProductsForSelect = async (shopId: string) => {
  const res = await productApi.get("/", { params: { pageIndex: 1, pageSize: 100, sortDirection: "asc", shopId } });
  return res.data.data?.items.map((item: any) => ({ label: item.productName, value: item.id })) ?? [];
};
