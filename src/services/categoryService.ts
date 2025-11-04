import { apiInstance } from '@/constants/api';

const categoryApi = apiInstance.create();

const BASE_CATEGORY_API_URL = "/servicecategory";

export interface CategoryApiData {
  id: string;
  name: string;
  description?: string;
  status?: "Hoạt động" | "Ngưng hoạt động";
  shopId?: string;
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

export interface CreateCategoryRequest {
  name: string;
  shopId: string;
}

export interface UpdateCategoryRequest {
  name: string;
  shopId: string;
}

export interface CreateCategoryResponseData extends CategoryApiData {
  id: string;
  shopId: string;
}

export const categoryService = {
  getServiceCategory: async (shopId: string): Promise<ApiDataWrapper<CategoryApiData>> => {
    const pageIndex = 1;
    const pageSize = 10;
    const sortDirection = "asc";

    try {
      const response = await categoryApi.get(BASE_CATEGORY_API_URL, {
        params: { pageIndex, pageSize, sortDirection, shopId }
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createServiceCategory: async (data: CreateCategoryRequest): Promise<CreateCategoryResponseData> => {
    try {
      const response = await categoryApi.post(BASE_CATEGORY_API_URL, data);

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateServiceCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<void> => {
    try {
      const response = await categoryApi.put(`${BASE_CATEGORY_API_URL}/${categoryId}`, data);

      // No return data for update
    } catch (error) {
      throw error;
    }
  },

  deleteServiceCategory: async (categoryId: string): Promise<void> => {
    try {
      const response = await categoryApi.delete(`${BASE_CATEGORY_API_URL}/${categoryId}`);

      // No return data for delete
    } catch (error) {
      throw error;
    }
  },
};
