"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Tag, message } from "antd";
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
  | "Danh mục dịch vụ"
  | "Chi Tiết Dịch Vụ"
  | "Danh mục sản phẩm"
  | "Chi Tiết Sản Phẩm"; // ✅ Thêm hai tab mới
export type StoreStatusType = "all" | "Hoạt động" | "Ngưng hoạt động";
export type ItemType = "service" | "product" | "category" | "service-detail" | "product-category"; // ✅ Thêm product-category
export type StoreItemData =
  | ServiceData
  | ProductData
  | CategoryData
  | ServiceDetailData
  | ProductCategoryData; // ✅ Thêm ProductCategoryData

// === HELPER ===
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount);

const getStatusHexColor = (
  status: "Hoạt động" | "Ngưng hoạt động"
): string => (status === "Hoạt động" ? "#10B981" : "#DC2626");

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
  const [serviceDetailData, setServiceDetailData] = useState<ServiceDetailData[]>([]);

  // === STATE STATUS ===
  const [shopId, setShopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingShop, setIsFetchingShop] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === STATE UI ===
  const [activeTab, setActiveTab] = useState<StoreTabType>("Dịch Vụ");
  const [activeStatusFilter, setActiveStatusFilter] = useState<StoreStatusType>("all");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItemData | null>(null);

  // === FETCH DATA FUNCTIONS ===
  const fetchCategories = async (currentShopId: string) => {
    const categoriesResponse = await categoryService.getServiceCategory(currentShopId);
    setCategoryData(
      (categoriesResponse?.items || []).map((item: any) => ({
        ...item,
        key: String(item.id || item.key),
      }))
    );
  };

  const fetchProductCategories = async (currentShopId: string) => {
    const productCategoriesResponse = await productCategoryService.getProductCategories(currentShopId);
    setProductCategoryData(
      (productCategoriesResponse?.items || []).map((item: any) => ({
        ...item,
        key: String(item.id || item.key),
      }))
    );
  };

  const fetchServices = async (currentShopId: string) => {
    const servicesResponse = await serviceService.getAllServices(currentShopId);
    setServiceData(
      (servicesResponse?.items || []).map((item: any) => ({
        ...item,
        key: String(item.id || item.key),
        serviceCategoryId: String(item.serviceCategoryId || item.key),
      }))
    );
  };

  const fetchProducts = async (currentShopId: string) => {
    const productsResponse = await productService.getProducts(currentShopId);
    setProductData(
      (productsResponse?.items || []).map((item: any) => ({
        ...item,
        key: String(item.id || item.key),
        productCategoryId: String(item.productCategoryId || item.key),
      }))
    );
  };

  const fetchServiceDetails = async (currentShopId: string) => {
    const serviceDetailsResponse = await serviceDetailService.getServiceDetails(currentShopId);
    setServiceDetailData(
      (serviceDetailsResponse?.items || []).map((item: any) => ({
        ...item,
        key: String(item.id || item.key),
      }))
    );
  };

  // === FETCH SHOP ID ===
  const fetchShopId = async () => {
    if (isFetchingShop || shopId) return; // Prevent duplicate calls
    setIsFetchingShop(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      if (!token) throw new Error("Không tìm thấy token đăng nhập.");

      const userId = getUserIdFromTokenPayload(token);
      if (!userId) throw new Error("Không thể xác định User ID.");

      const shopResponse = await shopService.getShops();
      const ownedShop = shopResponse.items?.find(
        (shop: any) => shop.ownerId === userId
      );

      if (ownedShop) {
        setShopId(ownedShop.id);
      } else {
        message.warning("Người dùng hiện tại không sở hữu cửa hàng nào.");
      }
    } catch (err) {
      console.error("Lỗi fetch shopId:", err);
    } finally {
      setIsFetchingShop(false);
    }
  };

  const fetchDataForTab = useCallback(async (tab: StoreTabType) => {
    if (!shopId || isLoading) return; // Wait for shopId and prevent concurrent fetches

    setIsLoading(true);
    setError(null);

    try {
      // Fetch data based on active tab
      switch (tab) {
        case "Danh mục dịch vụ":
          if (categoryData.length === 0) await fetchCategories(shopId);
          break;
        case "Danh mục sản phẩm":
          if (productCategoryData.length === 0) await fetchProductCategories(shopId);
          break;
        case "Dịch Vụ":
          if (serviceData.length === 0) await fetchServices(shopId);
          if (categoryData.length === 0) await fetchCategories(shopId); // Services need categories
          break;
        case "Sản Phẩm":
          if (productData.length === 0) await fetchProducts(shopId);
          if (productCategoryData.length === 0) await fetchProductCategories(shopId); // Products need product categories
          break;
        case "Chi Tiết Dịch Vụ":
          if (serviceDetailData.length === 0) await fetchServiceDetails(shopId);
          if (serviceData.length === 0) await fetchServices(shopId); // Service details need services
          break;
        case "Chi Tiết Sản Phẩm":
          // Not implemented yet
          break;
        default:
          break;
      }
    } catch (err: any) {
      console.error("Lỗi API khi lấy dữ liệu:", err);
      setError(
        `Không thể tải dữ liệu từ server. Chi tiết: ${
          err.message || "Lỗi không xác định"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }, [shopId, isLoading, categoryData.length, productCategoryData.length, serviceData.length, productData.length, serviceDetailData.length]);

  useEffect(() => {
    if (!shopId && !isFetchingShop) {
      fetchShopId();
    }
  }, []); // Only on mount

  useEffect(() => {
    if (shopId && !isLoading) {
      fetchDataForTab(activeTab);
    }
  }, [activeTab, shopId, fetchDataForTab]);

  // === HÀM MỞ FORM MODAL ===
  const handleOpenFormModal = (item: StoreItemData | null) => {
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
      fetchDataForTab(activeTab);
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
      fetchDataForTab(activeTab);
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
      fetchDataForTab(activeTab);
      return;
    }

    // === PRODUCT ===
    if (type === "product") {
      const payload = {
        name: values.name,
        stock: values.stock,
        price: values.price, // Thêm price
        discount: values.discount, // Thêm discount
        description: values.description || "",
        shopId,
        status: values.status === "Hoạt động",
        productCategoryId: values.productCategoryId,
        imageFile: values.image?.[0]?.originFileObj || null, // Thêm imageFile
      };

      if (editingItem) {
        await productService.updateProduct(editingItem.key, payload); // ✅ Gọi updateProduct
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(payload); // ✅ Gọi createProduct
        message.success("Thêm sản phẩm thành công!");
      }

      setIsFormModalOpen(false);
      setEditingItem(null);
      fetchDataForTab(activeTab);
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
        fetchDataForTab(activeTab); // Gọi fetchData để cập nhật dữ liệu
      } else if (type === "product") {
        await productService.deleteProduct(key); // ✅ Gọi deleteProduct
        message.success("Đã xóa sản phẩm!");
        fetchDataForTab(activeTab); // Gọi fetchData để cập nhật dữ liệu
      } else if (type === "category") {
        await categoryService.deleteServiceCategory(key); // ✅ Gọi deleteServiceCategory
        message.success("Đã xóa danh mục!");
        fetchDataForTab(activeTab); // Gọi fetchData để cập nhật dữ liệu
      } else if (type === "product-category") {
        await productCategoryService.deleteProductCategory(key); // ✅ Gọi deleteProductCategory
        message.success("Đã xóa danh mục sản phẩm!");
        fetchDataForTab(activeTab); // Gọi fetchData để cập nhật dữ liệu
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
  fetchDataForTab,
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
};

}
