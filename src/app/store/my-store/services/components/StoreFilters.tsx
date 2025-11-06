"use client";
import { Button, Input, Select, Card, Row, Col } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { JSX, useState } from "react";
import { CategoryData, StoreTabType, ItemType, ProductCategoryData, useStoreData } from "../hooks/useStoreData";

import CategoryFormModal from "./form/CategoryFormModal";
import ServiceFormModal from "./form/ServiceFormModal";
import ProductFormModal from "./form/ProductFormModal";
import ProductCategoryFormModal from "./form/ProductCategoryFormModal";
import ProductDetailFormModal from "./form/ProductDetailFormModal";
import { productDetailService } from "@/services/productDetailService";

interface StoreFiltersProps {
  activeTab: StoreTabType;
  categoryData: CategoryData[];
  productCategoryData?: ProductCategoryData[];
  handleSaveAction: (values: any, type: ItemType) => Promise<void>;
  isAdvancedSearchOpen: boolean;
  setIsAdvancedSearchOpenAction: (isOpen: boolean) => void;
  activeStatusFilter: "all" | "Hoạt động" | "Ngưng hoạt động";
  setActiveStatusFilterAction: (status: "all" | "Hoạt động" | "Ngưng hoạt động") => void;
  isFormModalOpen: boolean;
  setIsFormModalOpenAction: (isOpen: boolean) => void;
  editingItem: any;
}

export default function StoreFilters({
  activeTab,
  categoryData,
  productCategoryData = [],
  handleSaveAction,
  isAdvancedSearchOpen,
  setIsAdvancedSearchOpenAction,
  activeStatusFilter,
  setActiveStatusFilterAction,
  isFormModalOpen,
  setIsFormModalOpenAction,
  editingItem,
}: StoreFiltersProps): JSX.Element {
  const { fetchData } = useStoreData();

  const handleSubmit = async (values: any) => {
    if (activeTab === "Category") {
      values.shopId = "SHOP_ID_CUA_BAN";
      await handleSaveAction(values, "category");
    } else if (activeTab === "Dịch Vụ") {
      await handleSaveAction(values, "service");
    } else if (activeTab === "Sản Phẩm") {
      await handleSaveAction(values, "product");
    } else if (activeTab === "Category Sản Phẩm") {
      await handleSaveAction(values, "product-category");
    } else if (activeTab === "Chi Tiết Sản Phẩm") {
      // values should contain productId and detail fields from the modal
      await productDetailService.createProductDetail(values.productId, {
        name: values.name,
        price: Number(values.price),
        status: Boolean(values.status),
        discount: Number(values.discount || 0),
        isDefault: Boolean(values.isDefault),
        imgUrls: values.imgUrls || "",
        quantityInStock: Number(values.quantityInStock || 0),
      });
      // Refetch data after creating product detail
      fetchData();
    }
    setIsFormModalOpenAction(false);
  };

  return (
    <Card className="shadow-lg rounded-xl mb-6">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={10} lg={6}>
          <Select defaultValue="name" size="large">
            <Select.Option value="name">Tên</Select.Option>
          </Select>
        </Col>

        <Col xs={24} md={14} lg={10}>
          <Input placeholder="Nhập từ khóa..." size="large" />
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Button
            size="large"
            icon={<SearchOutlined />}
            className="w-full bg-teal-500 text-white"
          >
            Tìm kiếm
          </Button>
        </Col>

        <Col xs={24} md={12} lg={4} className="flex justify-end">
          <Button
            size="large"
            icon={<PlusOutlined />}
            className="bg-green-500!"
            onClick={() => setIsFormModalOpenAction(true)}
          />
        </Col>
      </Row>

      {activeTab === "Category" && (
        <CategoryFormModal open={isFormModalOpen} onCancelAction={() => setIsFormModalOpenAction(false)} onSubmitAction={handleSubmit} />
      )}

      {activeTab === "Dịch Vụ" && (
        <ServiceFormModal
          open={isFormModalOpen}
          onCancelAction={() => setIsFormModalOpenAction(false)}
          onSubmitAction={handleSubmit}
          categoryData={categoryData}
        />
      )}

      {activeTab === "Sản Phẩm" && (
        <ProductFormModal
          open={isFormModalOpen}
          onCancelAction={() => setIsFormModalOpenAction(false)}
          onSubmitAction={handleSubmit}
          editingItem={editingItem}
          categoryData={productCategoryData}
        />
      )}

      {activeTab === "Category Sản Phẩm" && (
        <ProductCategoryFormModal
          open={isFormModalOpen}
          onCancelAction={() => setIsFormModalOpenAction(false)}
          onSubmitAction={handleSubmit}
        />
      )}

      {activeTab === "Chi Tiết Sản Phẩm" && (
        <ProductDetailFormModal
          open={isFormModalOpen}
          onCancelAction={() => setIsFormModalOpenAction(false)}
          onSuccessAction={() => {}}
        />
      )}
    </Card>
  );
}
