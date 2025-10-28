const BASE_CATEGORY_API_URL = "https://category.devnest.io.vn/api/servicecategory";

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

    const url = `${BASE_CATEGORY_API_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortDirection=${sortDirection}&shopId=${shopId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "*/*" },
      });

      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

      const result: ApiResponse<ApiDataWrapper<CategoryApiData>> = await response.json();
      if (!result.success) throw new Error(`Lỗi API: ${result.message}`);

      return result.data;
    } catch (error) {
      throw error;
    }
  },

  createServiceCategory: async (data: CreateCategoryRequest): Promise<CreateCategoryResponseData> => {
    try {
      const response = await fetch(BASE_CATEGORY_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

      const result: ApiResponse<CreateCategoryResponseData> = await response.json();

      if (!result.success) throw new Error(`Lỗi API: ${result.message}`);

      return result.data;
    } catch (error) {
      throw error;
    }
  },

  updateServiceCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<void> => {
    const url = `${BASE_CATEGORY_API_URL}/${categoryId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
    } catch (error) {
      throw error;
    }
  },

  deleteServiceCategory: async (categoryId: string): Promise<void> => {
    const url = `${BASE_CATEGORY_API_URL}/${categoryId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { Accept: "*/*" },
      });

      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
    } catch (error) {
      throw error;
    }
  },
};
