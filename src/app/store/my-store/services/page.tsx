// src/app/store/my-store/services/page.tsx

"use client";

import { JSX } from 'react';
import { Card } from 'antd';
import { useStoreData } from './hooks/useStoreData';

// Components
import StoreHeader from './components/StoreHeader';
import ServiceProductTabs from './components/ServiceProductTabs';
import StoreFilters from './components/StoreFilters';
import ServiceTable from './components/ServiceTable';
import ProductTable from './components/ProductTable';

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
        
        // Thêm các hàm và state mới
        handleDelete,
        handleOpenFormModal,
        handleSave,
        isFormModalOpen,
        setIsFormModalOpen,
        editingItem,
    } = useStoreData();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* 1. Header Giới Thiệu Cửa Hàng */}
            <StoreHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* 2. Nút chuyển đổi Dịch Vụ / Sản Phẩm */}
                <ServiceProductTabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                />

                {/* 3. Lọc, Tìm kiếm và Nút Thêm */}
                <StoreFilters
                    isAdvancedSearchOpen={isAdvancedSearchOpen}
                    setIsAdvancedSearchOpen={setIsAdvancedSearchOpen}
                    activeStatusFilter={activeStatusFilter}
                    setActiveStatusFilter={setActiveStatusFilter}
                    // Truyền Prop cho Modal Form
                    isFormModalOpen={isFormModalOpen}
                    setIsFormModalOpen={setIsFormModalOpen}
                    editingItem={editingItem}
                    activeTab={activeTab}
                    handleSave={handleSave}
                />

                {/* 4. Bảng Dịch Vụ / Sản Phẩm */}
                <Card bordered={false} className="shadow-lg rounded-xl">
                    {activeTab === 'Dịch Vụ' ? (
                        <ServiceTable 
                            data={filteredServiceData} 
                            handleDelete={handleDelete} // Truyền Prop Xóa
                            handleOpenFormModal={handleOpenFormModal as any} // Truyền Prop Sửa
                        />
                    ) : (
                        <ProductTable 
                            data={filteredProductData} 
                            handleDelete={handleDelete} // Truyền Prop Xóa
                            handleOpenFormModal={handleOpenFormModal as any} // Truyền Prop Sửa
                        />
                    )}
                </Card>
            </div>
        </div>
    );
}