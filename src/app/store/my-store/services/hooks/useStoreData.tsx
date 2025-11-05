"use client";
import { useState, useMemo, useEffect, useRef } from "react";
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
  const [selectedProductCategoryId, setSelectedProductCategoryId] = useState<string | null>(null);
  const fetchProductsByCategoryId = async (categoryId: string) => {
    const productsResponse = await productService.getProductsByCategory(categoryId);
    setProductData(
      (productsResponse?.items || []).map((item: any) => {
        let firstImage = "";
        try {
          const arr = typeof item.imgUrls === 'string' ? JSON.parse(item.imgUrls) : item.imgUrls;
          firstImage = Array.isArray(arr) && arr.length > 0 ? String(arr[0]) : "";
        } catch (_) {
          firstImage = "";
        }
        return {
          ...item,
          key: String(item.id || item.key),
          productCategoryId: String(item.productCategoryId || item.key),
          name: item.productName ?? item.name,
          image: firstImage,
        };
      })
    );
  };

  const selectProductCategory = async (categoryId: string) => {
    setSelectedProductCategoryId(categoryId);
    await fetchProductsByCategoryId(categoryId);
  };

  // === STATE STATUS ===
  const [shopId, setShopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          // Trả về để chờ vòng render tiếp theo gọi lại với shopId đã có, tránh gọi API 2 lần
          isFetchingRef.current = false;
          setIsLoading(false);
          return;
        } else {
          message.warning("Người dùng hiện tại không sở hữu cửa hàng nào.");
          setIsLoading(false);
          return;
        }
      }

      if (!currentShopId) return;

      // === FETCH THEO TAB ĐANG MỞ ===
      if (activeTab === "Category Sản Phẩm") {
        const productCategoriesResponse = await productCategoryService.getProductCategories(currentShopId);
        setProductCategoryData(
          (productCategoriesResponse?.items || []).map((item: any) => ({
            ...item,
            key: String(item.id || item.key),
          }))
        );
        return;
      }

      if (activeTab === "Sản Phẩm") {
        // Đảm bảo đã có danh mục sản phẩm để hiển thị autocomplete
        let categories = productCategoryData;
        if (!categories || categories.length === 0) {
          const productCategoriesResponse = await productCategoryService.getProductCategories(currentShopId);
          categories = (productCategoriesResponse?.items || []).map((item: any) => ({
            ...item,
            key: String(item.id || item.key),
          }));
          setProductCategoryData(categories);
        }

        let categoryId = selectedProductCategoryId;
        if (!categoryId && categories.length > 0) {
          categoryId = categories[0].key;
          setSelectedProductCategoryId(categoryId);
        }

        if (categoryId) {
          await fetchProductsByCategoryId(categoryId);
        } else {
          setProductData([]);
        }

        return;
      }

      if (activeTab === "Chi Tiết Sản Phẩm") {
        // Tạm thời chưa có API riêng; không fetch gì thêm
        return;
      }

      if (activeTab === "Dịch Vụ") {
        const [categoriesResponse, servicesResponse] = await Promise.all([
          categoryService.getServiceCategory(currentShopId),
          serviceService.getAllServices(currentShopId),
        ]);
        setCategoryData(
          (categoriesResponse?.items || []).map((item: any) => ({
            ...item,
            key: String(item.id || item.key),
          }))
        );
        setServiceData(
          (servicesResponse?.items || []).map((item: any) => ({
            ...item,
            key: String(item.id || item.key),
            serviceCategoryId: String(item.serviceCategoryId || item.key),
          }))
        );
        return;
      }

      if (activeTab === "Chi Tiết Dịch Vụ") {
        const serviceDetailsResponse = await serviceDetailService.getServiceDetails(currentShopId);
        setServiceDetailData(
          (serviceDetailsResponse?.items || []).map((item: any) => ({
            ...item,
            key: String(item.id || item.key),
          }))
        );
        return;
      }
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
      fetchData();
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
      fetchData();
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
      fetchData();
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
        // Map sang schema API PUT Products/{id}
        await productService.updateProduct(editingItem.key, {
          productName: values.name,
          description: values.description || "",
          status: values.status === "Hoạt động",
          imgUrls: "[]", // có thể map từ upload sau
        });
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(payload); // ✅ Gọi createProduct
        message.success("Thêm sản phẩm thành công!");
      }

      setIsFormModalOpen(false);
      setEditingItem(null);
      fetchData();
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
        fetchData(); // Gọi fetchData để cập nhật dữ liệu
      } else if (type === "product") {
        await productService.deleteProduct(key); // ✅ Gọi deleteProduct
        message.success("Đã xóa sản phẩm!");
        fetchData(); // Gọi fetchData để cập nhật dữ liệu
      } else if (type === "category") {
        await categoryService.deleteServiceCategory(key); // ✅ Gọi deleteServiceCategory
        message.success("Đã xóa danh mục!");
        fetchData(); // Gọi fetchData để cập nhật dữ liệu
      } else if (type === "product-category") {
        await productCategoryService.deleteProductCategory(key); // ✅ Gọi deleteProductCategory
        message.success("Đã xóa danh mục sản phẩm!");
        fetchData(); // Gọi fetchData để cập nhật dữ liệu
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
