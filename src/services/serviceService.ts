
interface ApiResponse<T> {
  items: T[];
  totalItems: number;
}
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

const BASE_SERVICE_API_URL = "https://service.devnest.io.vn/api/service";

export const serviceService = {
  getServices: async (
    categoryId: string
  ): Promise<ApiResponse<ServiceApiData>> => {
    const pageIndex = 1;
    const pageSize = 10;
    const sortDirection = "asc";
    const url = `${BASE_SERVICE_API_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&serviceCategoryId=${categoryId}`;

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
      const result = await response.json();
      return result.data as ApiResponse<ServiceApiData>;
    } catch (error) {
      throw error;
    }
  },

  getAllServices: async (shopId: string): Promise<ApiResponse<ServiceApiData>> => {
    const pageIndex = 1;
    const pageSize = 100;
    const sortDirection = "asc";
    const url = `${BASE_SERVICE_API_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&shopId=${shopId}`;

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
      const result = await response.json();
      return result.data as ApiResponse<ServiceApiData>;
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

    const url = `${BASE_SERVICE_API_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&serviceCategoryId=${categoryId}`;

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

      const result = await response.json();

      return result.data as ApiResponse<ServiceApiData>;
    } catch (error) {
      throw error;
    }
  },

  getServicesByCategory: async (categoryId: string) => {
    const pageIndex = 1;
    const pageSize = 10;
    const sortDirection = "asc";

    const url = `https://service.devnest.io.vn/api/service?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&serviceCategoryId=${categoryId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "*/*" },
      });

      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

      const result = await response.json();
      if (!result.success)
        throw new Error(
          `Lỗi API: ${result.message || "Không thể lấy dịch vụ"}`
        );

      return result.data;
    } catch (error) {
      throw error;
    }
  },

  createService: async (
    data: CreateServiceRequest
  ): Promise<CreateServiceResponseData> => {
    const url = BASE_SERVICE_API_URL;

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
      const response = await fetch(url, {
        method: "POST",
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

      return result.data as CreateServiceResponseData;
    } catch (error) {
      throw error;
    }
  },

  deleteService: async (serviceId: string): Promise<void> => {
    const url = `${BASE_SERVICE_API_URL}/${serviceId}`;

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
