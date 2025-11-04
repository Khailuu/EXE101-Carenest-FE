"use client";
import { Button, Input, Select, Card, Row, Col } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { JSX, useState } from "react";
import { CategoryData, StoreTabType, ItemType } from "../hooks/useStoreData";

import CategoryFormModal from "./form/CategoryFormModal";
import ServiceFormModal from "./form/ServiceFormModal";
import ProductFormModal from "./form/ProductFormModal";
import ProductCategoryFormModal from "./form/ProductCategoryFormModal";

interface StoreFiltersProps {
  activeTab: StoreTabType;
  categoryData: CategoryData[];
  handleSave: (values: any, type: ItemType) => Promise<void>;
  isAdvancedSearchOpen: boolean;
  setIsAdvancedSearchOpen: (isOpen: boolean) => void;
  activeStatusFilter: "all" | "Hoạt động" | "Ngưng hoạt động";
  setActiveStatusFilter: (status: "all" | "Hoạt động" | "Ngưng hoạt động") => void;
  isFormModalOpen: boolean;
  setIsFormModalOpen: (isOpen: boolean) => void;
  editingItem: any;
}

export default function StoreFilters({
  activeTab,
  categoryData,
  handleSave,
  isAdvancedSearchOpen,
  setIsAdvancedSearchOpen,
  activeStatusFilter,
  setActiveStatusFilter,
  isFormModalOpen,
  setIsFormModalOpen,
  editingItem,
}: StoreFiltersProps): JSX.Element {

  const handleSubmit = async (values: any) => {
    if (activeTab === "Danh mục dịch vụ") {
      values.shopId = "SHOP_ID_CUA_BAN";
      await handleSave(values, "category");
    } else if (activeTab === "Danh mục sản phẩm") {
      await handleSave(values, "product-category");
    } else if (activeTab === "Dịch Vụ") {
      await handleSave(values, "service");
    } else if (activeTab === "Sản Phẩm") {
      await handleSave(values, "product");
    }
    setIsFormModalOpen(false);
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
            onClick={() => setIsFormModalOpen(true)}
          />
        </Col>
      </Row>

      {activeTab === "Danh mục dịch vụ" && (
        <CategoryFormModal open={isFormModalOpen} onCancel={() => setIsFormModalOpen(false)} onSubmit={handleSubmit} />
      )}

      {activeTab === "Danh mục sản phẩm" && (
        <ProductCategoryFormModal open={isFormModalOpen} onCancel={() => setIsFormModalOpen(false)} onSubmit={handleSubmit} />
      )}

      {activeTab === "Dịch Vụ" && (
        <ServiceFormModal
          open={isFormModalOpen}
          onCancel={() => setIsFormModalOpen(false)}
          onSubmit={handleSubmit}
          categoryData={categoryData}
        />
      )}

      {activeTab === "Sản Phẩm" && (
        <ProductFormModal
          open={isFormModalOpen}
          onCancel={() => setIsFormModalOpen(false)}
          onSubmit={handleSubmit}
          categoryData={categoryData}
        />
      )}
    </Card>
  );
}
