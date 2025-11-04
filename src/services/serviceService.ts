
import { apiInstance } from '@/constants/api';

const serviceApi = apiInstance.create();
export interface ServiceApiData {
  id: string;
  name: string;
  image: string;
  description: string;
  status: "Hoạt động" | "Ngưng hoạt động";
  serviceCategoryId: string;
  shopId: string;
}

interface CreateServiceRequest {
  name: string;
  description: string;
  serviceCategoryId: string;
  shopId: string;
  status: boolean;
  imageFile: File | null;
}

interface CreateServiceResponseData extends ServiceApiData {
}

const BASE_SERVICE_API_URL = "/service";

export const serviceService = {
  getServices: async (
    categoryId: string
  ): Promise<ApiResponse<ServiceApiData>> => {
    const pageIndex = 1;
    const pageSize = 10;
    const sortDirection = "asc";

    try {
      const response = await serviceApi.get(BASE_SERVICE_API_URL, {
        params: { pageIndex, pageSize, sortDirection, serviceCategoryId: categoryId }
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getAllServices: async (shopId: string): Promise<ApiResponse<ServiceApiData>> => {
    const pageIndex = 1;
    const pageSize = 100;
    const sortDirection = "asc";

    try {
      const response = await serviceApi.get(BASE_SERVICE_API_URL, {
        params: { pageIndex, pageSize, sortDirection, shopId }
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getServicesByCategoryId: async (
    categoryId: string
  ): Promise<ApiResponse<ServiceApiData>> => {
    const pageIndex = 1;
    const pageSize = 10;
    const sortDirection = "asc";

    try {
      const response = await serviceApi.get(BASE_SERVICE_API_URL, {
        params: { pageIndex, pageSize, sortDirection, serviceCategoryId: categoryId }
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getServicesByCategory: async (categoryId: string) => {
    const pageIndex = 1;
    const pageSize = 10;
    const sortDirection = "asc";

    try {
      const response = await serviceApi.get(BASE_SERVICE_API_URL, {
        params: { pageIndex, pageSize, sortDirection, serviceCategoryId: categoryId }
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createService: async (
    data: CreateServiceRequest
  ): Promise<CreateServiceResponseData> => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("ServiceCategoryId", data.serviceCategoryId);
    formData.append("ShopId", data.shopId);
    formData.append("Status", data.status ? "true" : "false");

    if (data.imageFile) {
      formData.append("ImageFile", data.imageFile);
    }

    try {
      const response = await serviceApi.post(BASE_SERVICE_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteService: async (serviceId: string): Promise<void> => {
    try {
      const response = await serviceApi.delete(`${BASE_SERVICE_API_URL}/${serviceId}`);

      // No return data for delete
    } catch (error) {
      throw error;
    }
  },
};
