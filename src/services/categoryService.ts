import { apiInstance } from '@/constants/api';
import { AxiosResponse } from 'axios';

const categoryApi = apiInstance.create({ baseURL: 'https://near-anthea-nghi-dna-28c211f8.koyeb.app/api/servicecategory/by-shop' });

const BASE_CATEGORY_API_URL = "/";

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
  getServiceCategory: async (shopId: string): Promise<AxiosResponse<CategoryApiData>> => {
    try {
      // Call: GET https://.../api/servicecategory/by-shop/{shopId}
      const response = await categoryApi.get(`/${shopId}`);

      return response;
    } catch (error) {
      throw error;
    }
  },

  createServiceCategory: async (data: CreateCategoryRequest): Promise<AxiosResponse<CreateCategoryResponseData>> => {
    try {
      const response = await categoryApi.post(BASE_CATEGORY_API_URL, data);

      return response;
    } catch (error) {
      throw error;
    }
  },

  updateServiceCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<AxiosResponse<void>> => {
    try {
      const response = await categoryApi.put(`${BASE_CATEGORY_API_URL}/${categoryId}`, data);

      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteServiceCategory: async (categoryId: string): Promise<AxiosResponse<void>> => {
    try {
      const response = await categoryApi.delete(`${BASE_CATEGORY_API_URL}/${categoryId}`);

              return response;
    } catch (error) {
      throw error;
    }
  },
};
