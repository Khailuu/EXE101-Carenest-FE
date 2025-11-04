"use client";

import { JSX } from "react";
import { Card } from "antd";
import { useStoreData, StoreItemData } from "./hooks/useStoreData";
import { useState, useEffect } from 'react';
import { AutoComplete, Input } from 'antd';
import { RootState } from '@/redux/store';
import { serviceService, ServiceApiData } from '@/services/serviceService';

// Components
import ServiceProductTabs from "./components/ServiceProductTabs";
import StoreFilters from "./components/StoreFilters";
import ServiceTable from "./components/ServiceTable";
import ProductTable from "./components/ProductTable";
import CategoryTable from "./components/CategoryTable";
import ServiceDetailTable from "./components/ServiceDetailTable";
import ProductCategoryTable from "./components/ProductCategoryTable";
import { useAppSelector } from '@/redux/hooks';

type StoreFiltersActiveTabType = "Dịch Vụ" | "Sản Phẩm" | "Danh mục dịch vụ" | "Danh mục sản phẩm" | "Chi Tiết Sản Phẩm";

export default function StoreServicePage(): JSX.Element {
  const {
    activeTab,
    setActiveTab,
    activeStatusFilter,
    setActiveStatusFilter,
    isAdvancedSearchOpen,
    setIsAdvancedSearchOpen,
    filteredServiceData,
    filteredProductData,
    filteredCategoryData,
    filteredServiceDetailData,
    filteredProductCategoryData,
    serviceData,
    categoryData,
    productCategoryData,
    handleDelete,
    handleOpenFormModal,
    handleSave,
    isFormModalOpen,
    setIsFormModalOpen,
    editingItem,
    isLoading,
  } = useStoreData();

  const shopId = useAppSelector((state) => state.user.shopId);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceOptions, setServiceOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (shopId) {
      const fetchServices = async () => {
        try {
          const response = await serviceService.getAllServices(shopId);
          const options = response.items.map(service => ({
            value: service.id,
            label: service.name,
          }));
          setServiceOptions(options);
          if (options.length > 0) {
            setSelectedServiceId(options[0].value);
          }
        } catch (error) {
          console.error("Failed to fetch services for autocomplete:", error);
        }
      };
      fetchServices();
    }
  }, [shopId]);

  const handleServiceSelect = (value: string, option: any) => {
    setSelectedServiceId(value);
  };

  const renderActiveTable = () => {
    const openModal = (item: StoreItemData | null) => handleOpenFormModal(item);

    switch (activeTab) {
      case "Danh mục dịch vụ":
        return (
          <CategoryTable
            data={filteredCategoryData}
            handleDelete={handleDelete as any}
            handleOpenFormModal={openModal as any}
          />
        );
      case "Danh mục sản phẩm":
        return (
          <ProductCategoryTable
            data={filteredProductCategoryData}
            handleDelete={handleDelete as any}
            handleOpenFormModal={openModal as any}
          />
        );
      case "Dịch Vụ":
        return (
          <ServiceTable
            data={filteredServiceData}
            categoryData={categoryData} 
            handleDelete={handleDelete}
            handleOpenFormModal={openModal as any}
            isLoading={isLoading}
          />
        );
      case "Chi Tiết Dịch Vụ":
        return (
          <>
            <div className="mb-4">
              <AutoComplete
                options={serviceOptions}
                style={{ width: '100%' }}
                onSelect={handleServiceSelect}
                placeholder="Chọn một dịch vụ"
                filterOption={(inputValue, option) =>
                  option!.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                value={serviceOptions.find(opt => opt.value === selectedServiceId)?.label || undefined}
              >
                <Input.Search size="large" placeholder="Tìm kiếm dịch vụ..." enterButton />
              </AutoComplete>
            </div>
            <ServiceDetailTable
              data={filteredServiceDetailData}
              handleDelete={handleDelete as any}
              handleOpenFormModal={openModal as any}
              serviceData={serviceData}
              selectedServiceId={selectedServiceId}
            />
          </>
        );
      case "Sản Phẩm":
        return (
          <ProductTable
            data={filteredProductData}
            handleDelete={handleDelete}
            handleOpenFormModal={openModal as any}
          />
        );
      case "Chi Tiết Sản Phẩm":
        return (
          <div>Chức năng Chi Tiết Sản Phẩm sẽ được phát triển sau.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ServiceProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <StoreFilters
          isAdvancedSearchOpen={isAdvancedSearchOpen}
          setIsAdvancedSearchOpen={setIsAdvancedSearchOpen}
          activeStatusFilter={activeStatusFilter}
          setActiveStatusFilter={setActiveStatusFilter}
          isFormModalOpen={isFormModalOpen}
          setIsFormModalOpen={setIsFormModalOpen}
          editingItem={editingItem}
          activeTab={activeTab as StoreFiltersActiveTabType}
          handleSave={handleSave as (values: any, type: string) => Promise<void>}
          categoryData={categoryData}
        />
        <Card bordered={false} className="shadow-lg rounded-xl">
          {renderActiveTable()}
        </Card>
      </div>
    </div>
  );
}
