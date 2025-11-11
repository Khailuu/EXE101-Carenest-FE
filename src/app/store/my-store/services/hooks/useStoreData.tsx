"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { Tag, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { JSX } from "react";

// === IMPORT SERVICE ===
import { shopService } from "@/services/shopService";
import { categoryService } from "@/services/categoryService";
import { serviceService } from "@/services/serviceService";
import { productService } from "@/services/productService";
import { serviceDetailService } from "@/services/serviceDetailService";
import { productCategoryService } from "@/services/productCategoryService"; // ✅ Import productCategoryService
import { getUserIdFromTokenPayload } from "@/services/authService";

// === INTERFACES ===
export interface CategoryData {
  key: string;
  name: string;
  description: string;
  status: "Hoạt động" | "Ngưng hoạt động";
}

export interface ProductCategoryData {
  key: string;
  name: string;
  shopId: string;
  status: "Hoạt động" | "Ngưng hoạt động";
}

export interface ServiceData {
  key: string;
  name: string;
  image: string;
  description: string;
  status: "Hoạt động" | "Ngưng hoạt động";
  serviceCategoryId: string;
}

export interface ProductData {
  key: string;
  name: string;
  stock: number;
  image: string;
  description: string;
  status: "Hoạt động" | "Ngưng hoạt động";
  productCategoryId: string;
  imgUrls?: string; // raw imgUrls string for edit usage
}

export interface ServiceDetailData {
  key: string;
  name: string;
  serviceId: string;
  price: number;
  duration: string;
  status: "Hoạt động" | "Ngưng hoạt động";
}

export type StoreTabType =
  | "Dịch Vụ"
  | "Sản Phẩm"
  | "Category"
  | "Chi Tiết Dịch Vụ"
  | "Category Sản Phẩm"
  | "Chi Tiết Sản Phẩm"; // ✅ Thêm hai tab mới
export type StoreStatusType = "all" | "Hoạt động" | "Ngưng hoạt động";
export type ItemType = "service" | "product" | "category" | "service-detail" | "product-category"; // ✅ Thêm product-category
export type StoreItemData =
  | ServiceData
  | ProductData
  | CategoryData
  | ServiceDetailData
  | ProductCategoryData;

// Helper to map status to consistent hex colors for tags
function getStatusHexColor(status: "Hoạt động" | "Ngưng hoạt động"): string {
  return status === "Hoạt động" ? "#52c41a" : "#f5222d";
}

export const renderStatusTag = (
  status: "Hoạt động" | "Ngưng hoạt động"
): JSX.Element => (
  <Tag
    color={getStatusHexColor(status)}
    className="font-semibold rounded-full py-1 px-3 border-0 text-white"
  >
    {status}
  </Tag>
);

// === MAIN HOOK ===
export function useStoreData() {
  // === STATE DATA ===
  const [serviceData, setServiceData] = useState<ServiceData[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [productCategoryData, setProductCategoryData] = useState<ProductCategoryData[]>([]); // ✅ Thêm state mới
  // React Query client for caching/invalidations
  const queryClient = useQueryClient();
  const [serviceDetailData, setServiceDetailData] = useState<ServiceDetailData[]>([]);
  const [selectedProductCategoryId, setSelectedProductCategoryId] = useState<string | null>(null);
  // product queries are created after shopId is known (below)

  const selectProductCategory = async (categoryId: string) => {
    // only set the selected category; productsQuery will automatically fetch for this category
    setSelectedProductCategoryId(categoryId);
  };

  // === STATE STATUS ===
  const [shopId, setShopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === React Query data hooks ===
  const productCategoriesQuery = useQuery({
    queryKey: ["productCategories", shopId],
    queryFn: async () => {
      if (!shopId) return [];
      const res: any = await productCategoryService.getProductCategories(shopId);
      return (res?.items || []).map((item: any) => ({ ...item, key: String(item.id || item.key) }));
    },
    enabled: !!shopId,
    staleTime: 1000 * 60 * 5,
  });

  const productsQuery = useQuery({
    queryKey: ["products", shopId, selectedProductCategoryId],
    queryFn: async () => {
      if (!shopId || !selectedProductCategoryId) return [];
      const productsResponse: any = await productService.getProductsByCategory(selectedProductCategoryId);

      const pickFirstImage = (imgUrls: any): string => {
        if (!imgUrls) return "";
        if (typeof imgUrls === "string") {
          const s = imgUrls.trim();
          if (!s) return "";
          if (s.startsWith("[")) {
            try {
              const arr = JSON.parse(s);
              return Array.isArray(arr) && arr.length > 0 ? String(arr[0]) : "";
            } catch {
              return s;
            }
          }
          return s;
        }
        if (Array.isArray(imgUrls)) return String(imgUrls[0] || "");
        return "";
      };

      return (productsResponse?.items || []).map((item: any) => {
        const firstImage = pickFirstImage(item.imgUrls);
        return {
          ...item,
          key: String(item.id || item.key),
          productCategoryId: String(item.productCategoryId || item.key),
          name: item.productName ?? item.name,
          image: firstImage,
          imgUrls:
            typeof item.imgUrls === "string"
              ? item.imgUrls
              : JSON.stringify(item.imgUrls || []),
        } as ProductData;
      });
    },
    enabled: !!shopId && !!selectedProductCategoryId,
    staleTime: 1000 * 60 * 5,
  });

  // Keep local state in sync with cached query results (so existing components can keep using the same props)
  useEffect(() => {
    if (productCategoriesQuery.data) {
      setProductCategoryData(productCategoriesQuery.data as ProductCategoryData[]);
      // Auto-select first product category when none selected to show a default list
      // NOTE: activeTab is declared later; avoid referencing it here to satisfy TS ordering.
      if (
        !selectedProductCategoryId &&
        (productCategoriesQuery.data as ProductCategoryData[]).length > 0
      ) {
        const first = (productCategoriesQuery.data as ProductCategoryData[])[0];
        setSelectedProductCategoryId(first.key);
      }
    }
  }, [productCategoriesQuery.data, selectedProductCategoryId]);

  useEffect(() => {
    if (productsQuery.data) {
      setProductData(productsQuery.data as ProductData[]);
    } else if (!selectedProductCategoryId) {
      setProductData([]);
    }
  }, [productsQuery.data, selectedProductCategoryId]);

  // === STATE UI ===
  const [activeTab, setActiveTab] = useState<StoreTabType>("Sản Phẩm");
  const [activeStatusFilter, setActiveStatusFilter] = useState<StoreStatusType>("all");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItemData | null>(null);
  const isFetchingRef = useRef(false);

  // === FETCH DATA ===
  const fetchData = async () => {
    if (isFetchingRef.current) return; // prevent concurrent duplicate calls
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    let currentShopId: string | null = shopId;

    try {
      if (!currentShopId) {
        const token = localStorage.getItem("authToken") || "";
        if (!token) throw new Error("Không tìm thấy token đăng nhập.");

        const userId = getUserIdFromTokenPayload(token);
        if (!userId) throw new Error("Không thể xác định User ID.");

        const shopResponse = await shopService.getShops();
        const ownedShop = shopResponse.items?.find(
          (shop: any) => shop.ownerId === userId
        );

        if (ownedShop) {
          currentShopId = ownedShop.id;
          setShopId(currentShopId);
          // Let React Query fetch product categories/products automatically once shopId is set
          isFetchingRef.current = false;
          setIsLoading(false);
          return;
        } else {
          message.warning("Người dùng hiện tại không sở hữu cửa hàng nào.");
          setIsLoading(false);
          return;
        }
      }

      // For other tabs we rely on React Query to keep cached data and avoid duplicate calls.
      // Invalidate queries related to tabs if caller explicitly wants fresh data.
  queryClient.invalidateQueries({ queryKey: ["productCategories"] });
  queryClient.invalidateQueries({ queryKey: ["products"] });
  queryClient.invalidateQueries({ queryKey: ["services"] });
  queryClient.invalidateQueries({ queryKey: ["serviceDetails"] });
    } catch (err: any) {
      console.error("Lỗi API khi lấy dữ liệu:", err);
      setError(
        `Không thể tải dữ liệu từ server. Chi tiết: ${
          err.message || "Lỗi không xác định"
        }`
      );
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shopId, activeTab]);

  // Đã loại bỏ prefetch để tránh gọi API lặp lại; sản phẩm danh mục sẽ được nạp khi cần trong fetchData

  // Bỏ refetch theo selectedProductCategoryId để tránh gọi lặp; dùng selectProductCategory thay thế

  // === HÀM MỞ FORM MODAL ===
  const handleOpenFormModal = async (item: StoreItemData | null) => {
    // When editing a product, fetch full data from server to ensure modal has all fields
    if (item && activeTab === "Sản Phẩm") {
      try {
        const full = await productService.getProductById(String((item as any).key));
        let firstImage = "";
        try {
          const arr = typeof full.imgUrls === 'string' ? JSON.parse(full.imgUrls) : full.imgUrls;
          firstImage = Array.isArray(arr) && arr.length > 0 ? String(arr[0]) : "";
        } catch (_) {
          firstImage = "";
        }
        const mapped: ProductData = {
          key: String(full.id),
          name: full.productName ?? full.name,
          stock: Number(full.stock ?? 0),
          image: firstImage,
          description: full.description ?? "",
          status: full.status ? "Hoạt động" : "Ngưng hoạt động",
          productCategoryId: String(full.productCategoryId ?? (item as any).productCategoryId ?? ""),
          imgUrls: typeof full.imgUrls === 'string' ? full.imgUrls : JSON.stringify(full.imgUrls || []),
        };
        setEditingItem(mapped);
        setIsFormModalOpen(true);
        return;
      } catch (e) {
        console.warn("Không thể tải đầy đủ dữ liệu sản phẩm, dùng dữ liệu hiện có.", e);
      }
    }
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  // === HÀM LƯU DỮ LIỆU (SERVICE/PRODUCT) ===
const handleSave = async (values: any, type: ItemType) => {
  try {
    if (!shopId) {
      message.error("Không tìm thấy Shop ID.");
      return;
    }

    // === CATEGORY ===
    if (type === "category") {
      const payload = {
        name: values.name,
        shopId,
      };

      if (editingItem) {
        await categoryService.updateServiceCategory(editingItem.key, payload);
        message.success("Cập nhật Category thành công!");
      } else {
        await categoryService.createServiceCategory(payload);
        message.success("Thêm Category thành công!");
      }

      setIsFormModalOpen(false);
      setEditingItem(null);
  // Invalidate related queries so React Query will refresh cached data
  queryClient.invalidateQueries({ queryKey: ["productCategories", shopId] });
  queryClient.invalidateQueries({ queryKey: ["products", shopId] });
      return;
    }

    // === PRODUCT CATEGORY ===
    if (type === "product-category") {
      const payload = {
        name: values.name,
        shopId,
      };

      if (editingItem) {
        await productCategoryService.updateProductCategory(editingItem.key, payload); // ✅ Gọi updateProductCategory
        message.success("Cập nhật Danh mục Sản phẩm thành công!");
      } else {
        await productCategoryService.createProductCategory(payload); // ✅ Gọi createProductCategory
        message.success("Thêm Danh mục Sản phẩm thành công!");
      }

      setIsFormModalOpen(false);
      setEditingItem(null);
  // Invalidate product categories cache
  queryClient.invalidateQueries({ queryKey: ["productCategories", shopId] });
  queryClient.invalidateQueries({ queryKey: ["products", shopId] });
      return;
    }

    // === SERVICE ===
    if (type === "service") {
      const payload = {
        name: values.name,
        description: values.description || "",
        serviceCategoryId: values.serviceCategoryId,
        shopId,
        status: values.status === "Hoạt động",
        imageFile: values.image?.[0]?.originFileObj || null,
      };

      if (editingItem) {
        // await serviceService.updateService(editingItem.key, payload);
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        await serviceService.createService(payload);
        message.success("Thêm dịch vụ thành công!");
      }

      setIsFormModalOpen(false);
      setEditingItem(null);
  queryClient.invalidateQueries({ queryKey: ["services", shopId] });
      return;
    }

    // === PRODUCT ===
    if (type === "product") {
      // Extract file from upload field - can be array, single object, or null
      let imageFile: File | null = null;
      if (values.image) {
        if (Array.isArray(values.image)) {
          imageFile = values.image[0]?.originFileObj || null;
        } else if (values.image?.originFileObj) {
          imageFile = values.image.originFileObj;
        }
      }

      const payload = {
        productName: values.productName,
        description: values.description || "",
        status: Boolean(values.status),
        productCategoryId: values.productCategoryId,
        imageFile: imageFile,
      };

      if (editingItem) {
        await productService.updateProduct(editingItem.key, {
          productName: values.productName,
          description: values.description || "",
          status: Boolean(values.status),
          imgUrls: values.imgUrls || (editingItem as any).imgUrls || "[]",
        });
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(payload);
        message.success("Thêm sản phẩm thành công!");
      }

      setIsFormModalOpen(false);
      setEditingItem(null);
  // Invalidate products for current shop/category
  queryClient.invalidateQueries({ queryKey: ["products", shopId] });
  queryClient.invalidateQueries({ queryKey: ["productCategories", shopId] });
      return;
    }
  } catch (err: any) {
    console.error("Lỗi khi lưu:", err);
    message.error(err?.message || "Lưu thất bại, vui lòng thử lại!");
  }
};


  // === HÀM XÓA ITEM ===
  const handleDelete = async (key: string, type: ItemType) => {
    try {
      if (type === "service") {
        await serviceService.deleteService(key);
        message.success("Đã xóa dịch vụ!");
        queryClient.invalidateQueries({ queryKey: ["services", shopId] });
      } else if (type === "product") {
        await productService.deleteProduct(key); // ✅ Gọi deleteProduct
        message.success("Đã xóa sản phẩm!");
        queryClient.invalidateQueries({ queryKey: ["products", shopId] });
      } else if (type === "category") {
        await categoryService.deleteServiceCategory(key); // ✅ Gọi deleteServiceCategory
        message.success("Đã xóa danh mục!");
        queryClient.invalidateQueries({ queryKey: ["categories", shopId] });
      } else if (type === "product-category") {
        await productCategoryService.deleteProductCategory(key); // ✅ Gọi deleteProductCategory
        message.success("Đã xóa danh mục sản phẩm!");
        queryClient.invalidateQueries({ queryKey: ["productCategories", shopId] });
      } else if (type === "service-detail") {
        // TODO: Implement deleteServiceDetail
        message.warning("Chức năng xóa chi tiết dịch vụ chưa được triển khai!");
      }
    } catch (err: any) {
      console.error("Lỗi xóa:", err);
      message.error("Xóa thất bại!");
    }
  };

  // === DỮ LIỆU SAU LỌC ===
  const filteredServiceData = useMemo(
    () =>
      activeStatusFilter === "all"
        ? serviceData
        : serviceData.filter((i) => i.status === activeStatusFilter),
    [serviceData, activeStatusFilter]
  );

  const filteredProductData = useMemo(
    () =>
      activeStatusFilter === "all"
        ? productData
        : productData.filter((i) => i.status === activeStatusFilter),
    [productData, activeStatusFilter]
  );

  const filteredCategoryData = useMemo(
    () =>
      activeStatusFilter === "all"
        ? categoryData
        : categoryData.filter((i) => i.status === activeStatusFilter),
    [categoryData, activeStatusFilter]
  );

  const filteredProductCategoryData = useMemo(
    () =>
      activeStatusFilter === "all"
        ? productCategoryData
        : productCategoryData.filter((i) => i.status === activeStatusFilter),
    [productCategoryData, activeStatusFilter]
  ); // ✅ Thêm filteredProductCategoryData

  const filteredServiceDetailData = useMemo(
    () =>
      activeStatusFilter === "all"
        ? serviceDetailData
        : serviceDetailData.filter((i) => i.status === activeStatusFilter),
    [serviceDetailData, activeStatusFilter]
  );

  // === RETURN ===
  // === RETURN ===
return {
  activeTab,
  setActiveTab,
  activeStatusFilter,
  setActiveStatusFilter,
  isAdvancedSearchOpen,
  setIsAdvancedSearchOpen,
  isFormModalOpen,
  setIsFormModalOpen,
  editingItem,
  setEditingItem,
  handleSave,
  handleDelete,
  handleOpenFormModal,
  fetchData,
  categoryData,
  serviceData,
  productData,
  serviceDetailData,
  productCategoryData, // ✅ Thêm productCategoryData vào return
  filteredServiceData,
  filteredProductData,
  filteredCategoryData,
  filteredServiceDetailData,
  filteredProductCategoryData, // ✅ Thêm filteredProductCategoryData vào return
  isLoading,
  error,
  shopId, // ✅ Thêm dòng này
  selectedProductCategoryId,
  setSelectedProductCategoryId,
  selectProductCategory,
};

}
