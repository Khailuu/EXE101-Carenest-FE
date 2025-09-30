// src/app/store/my-store/services/hooks/useStoreData.tsx

import { useState, useMemo, JSX } from 'react';
import { Tag, message } from 'antd'; // Thêm message để hiển thị thông báo

// --- TYPES (GIỮ NGUYÊN) ---
// ... (ServiceData, ProductData, StoreTabType, StoreStatusType)
export interface ServiceData {
  key: string;
  name: string;
  duration: string;
  price: number;
  discount: number;
  image: string;
  description: string;
  status: 'Hoạt động' | 'Ngưng hoạt động';
}

export interface ProductData {
  key: string;
  name: string;
  stock: number;
  price: number;
  discount: number;
  image: string;
  description: string;
  status: 'Hoạt động' | 'Ngưng hoạt động';
}

export type StoreTabType = 'Dịch Vụ' | 'Sản Phẩm';
export type StoreStatusType = 'all' | 'Hoạt động' | 'Ngưng hoạt động';
export type ItemType = 'service' | 'product';

// --- MOCK DATA (Sử dụng state để có thể thay đổi) ---
const initialServiceData: ServiceData[] = [
  // ... (Dữ liệu mẫu Dịch vụ giữ nguyên)
  { key: '1', name: 'Dịch vụ tắm cho chó', duration: '60 phút', price: 200000, discount: 10, image: 'https://i.pravatar.cc/150?img=1', description: 'Chúng tôi mang đến cho thú cưng của bạn trải nghiệm tắm rửa thư giãn, an toàn và chuyên nghiệp...', status: 'Hoạt động' },
  { key: '2', name: 'Dịch vụ chải lông cho chó', duration: '60 phút', price: 200000, discount: 10, image: 'https://i.pravatar.cc/150?img=2', description: 'Tuyệt chiêu giúp chó mèo luôn mượt mà và giảm tối đa lông rụng trong nhà...', status: 'Ngưng hoạt động' },
  { key: '3', name: 'Dịch vụ cho chó ăn', duration: '60 phút', price: 200000, discount: 10, image: 'https://i.pravatar.cc/150?img=3', description: 'Chúng tôi mang đến cho thú cưng của bạn trải nghiệm tắm rửa thư giãn, an toàn và chuyên nghiệp...', status: 'Hoạt động' },
  { key: '4', name: 'Dịch vụ chăm sóc', duration: '60 phút', price: 200000, discount: 10, image: 'https://i.pravatar.cc/150?img=4', description: 'Chúng tôi mang đến cho thú cưng của bạn trải nghiệm tắm rửa thư giãn, an toàn và chuyên nghiệp...', status: 'Ngưng hoạt động' },
  { key: '5', name: 'Dịch vụ giữ chó', duration: '60 phút', price: 200000, discount: 10, image: 'https://i.pravatar.cc/150?img=5', description: 'Chúng tôi mang đến cho thú cưng của bạn trải nghiệm tắm rửa thư giãn, an toàn và chuyên nghiệp...', status: 'Hoạt động' },
  { key: '6', name: 'Dịch vụ chích ngừa', duration: '60 phút', price: 200000, discount: 10, image: 'https://i.pravatar.cc/150?img=6', description: 'Chúng tôi mang đến cho thú cưng của bạn trải nghiệm tắm rửa thư giãn, an toàn và chuyên nghiệp...', status: 'Hoạt động' },
  { key: '7', name: 'Dịch vụ huấn luyện cho chó', duration: '60 phút', price: 200000, discount: 10, image: 'https://i.pravatar.cc/150?img=7', description: 'Chúng tôi mang đến cho thú cưng của bạn trải nghiệm tắm rửa thư giãn, an toàn và chuyên nghiệp...', status: 'Ngưng hoạt động' },
];

const initialProductData: ProductData[] = [
  // ... (Dữ liệu mẫu Sản phẩm giữ nguyên)
  { key: '1', name: 'Thức ăn cho mèo', stock: 12, price: 200000, discount: 10, image: 'https://picsum.photos/seed/catfood1/50/50', description: 'Thức ăn Cho Mèo – Dinh Dưỡng Dày Đủ, Mèo Khoẻ Mạnh Mỗi Ngày! Đặc biệt dành riêng cho hệ tiêu hoá và khẩu vị của mèo.', status: 'Hoạt động' },
  { key: '2', name: 'Thức ăn cho chó', stock: 12, price: 200000, discount: 10, image: 'https://picsum.photos/seed/dogfood1/50/50', description: 'Thức ăn Cho Chó – Dinh Dưỡng Dày Đủ, Chó Khoẻ Mạnh Mỗi Ngày! Công thức đặc biệt dành cho giống chó nhỏ.', status: 'Ngưng hoạt động' },
  { key: '3', name: 'Thức ăn cho mèo', stock: 12, price: 200000, discount: 10, image: 'https://picsum.photos/seed/catfood2/50/50', description: 'Thức ăn Cho Mèo – Dinh Dưỡng Dày Đủ, Mèo Khoẻ Mạnh Mỗi Ngày! Đặc biệt dành riêng cho hệ tiêu hoá và khẩu vị của mèo.', status: 'Hoạt động' },
  { key: '4', name: 'Thức ăn cho chó', stock: 12, price: 200000, discount: 10, image: 'https://picsum.photos/seed/dogfood2/50/50', description: 'Thức ăn Cho Chó – Dinh Dưỡng Dày Đủ, Chó Khoẻ Mạnh Mỗi Ngày! Công thức đặc biệt dành cho giống chó nhỏ.', status: 'Ngưng hoạt động' },
  { key: '5', name: 'Thức ăn cho mèo', stock: 12, price: 200000, discount: 10, image: 'https://picsum.photos/seed/catfood3/50/50', description: 'Thức ăn Cho Mèo – Dinh Dưỡng Dày Đủ, Mèo Khoẻ Mạnh Mỗi Ngày! Đặc biệt dành riêng cho hệ tiêu hoá và khẩu vị của mèo.', status: 'Hoạt động' },
  { key: '6', name: 'Thức ăn cho chó', stock: 12, price: 200000, discount: 10, image: 'https://picsum.photos/seed/dogfood3/50/50', description: 'Thức ăn Cho Chó – Dinh Dưỡng Dày Đủ, Chó Khoẻ Mạnh Mỗi Ngày! Công thức đặc biệt dành cho giống chó nhỏ.', status: 'Hoạt động' },
  { key: '7', name: 'Thức ăn cho mèo', stock: 12, price: 200000, discount: 10, image: 'https://picsum.photos/seed/catfood4/50/50', description: 'Thức ăn Cho Mèo – Dinh Dưỡng Dày Đủ, Mèo Khoẻ Mạnh Mỗi Ngày! Đặc biệt dành riêng cho hệ tiêu hoá và khẩu vị của mèo.', status: 'Hoạt động' },
];

// --- HELPER FUNCTIONS (GIỮ NGUYÊN) ---
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};
const getStatusHexColor = (status: 'Hoạt động' | 'Ngưng hoạt động'): string => {
  if (status === 'Hoạt động') return '#10B981';
  return '#DC2626';
};
export const renderStatusTag = (status: 'Hoạt động' | 'Ngưng hoạt động'): JSX.Element => {
  return (
    <Tag 
      color={getStatusHexColor(status)} 
      className="font-semibold rounded-full py-1 px-3 border-0 text-white"
    >
      {status}
    </Tag>
  );
};

// --- HOOK CHÍNH ---
export function useStoreData() {
  const [serviceData, setServiceData] = useState<ServiceData[]>(initialServiceData);
  const [productData, setProductData] = useState<ProductData[]>(initialProductData);
  
  const [activeTab, setActiveTab] = useState<StoreTabType>('Dịch Vụ');
  const [activeStatusFilter, setActiveStatusFilter] = useState<StoreStatusType>('all');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  
  // State quản lý Modal Thêm/Sửa
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceData | ProductData | null>(null);

  // LOGIC XOÁ
  const handleDelete = (key: string, type: ItemType) => {
    if (type === 'service') {
      setServiceData(prev => prev.filter(item => item.key !== key));
      message.success(`Đã xoá dịch vụ có mã ${key}`);
    } else {
      setProductData(prev => prev.filter(item => item.key !== key));
      message.success(`Đã xoá sản phẩm có mã ${key}`);
    }
  };

  // LOGIC SỬA/THÊM - mở modal
  const handleOpenFormModal = (item: ServiceData | ProductData | null) => {
    setEditingItem(item); // Đặt item đang sửa (null nếu là thêm mới)
    setIsFormModalOpen(true);
  };

  // LOGIC LƯU (Sửa/Thêm)
  const handleSave = (values: any, type: ItemType) => {
    const newItemKey = String(Math.max(...(type === 'service' ? serviceData : productData).map(item => Number(item.key))) + 1);
    
    if (type === 'service') {
        const itemToSave: ServiceData = { ...values, key: editingItem?.key || newItemKey, price: Number(values.price), discount: Number(values.discount) };
        if (editingItem) {
            setServiceData(prev => prev.map(item => (item.key === editingItem.key ? itemToSave : item)));
            message.success(`Đã cập nhật dịch vụ "${itemToSave.name}"`);
        } else {
            setServiceData(prev => [{ ...itemToSave, key: newItemKey }, ...prev]);
            message.success(`Đã thêm dịch vụ mới: "${itemToSave.name}"`);
        }
    } else {
        const itemToSave: ProductData = { ...values, key: editingItem?.key || newItemKey, stock: Number(values.stock), price: Number(values.price), discount: Number(values.discount) };
        if (editingItem) {
            setProductData(prev => prev.map(item => (item.key === editingItem.key ? itemToSave : item)));
            message.success(`Đã cập nhật sản phẩm "${itemToSave.name}"`);
        } else {
            setProductData(prev => [{ ...itemToSave, key: newItemKey }, ...prev]);
            message.success(`Đã thêm sản phẩm mới: "${itemToSave.name}"`);
        }
    }

    setIsFormModalOpen(false);
    setEditingItem(null);
  };


  // Logic lọc dữ liệu hiển thị trên bảng
  const filteredServiceData = useMemo(() => {
    if (activeStatusFilter === 'all') return serviceData;
    return serviceData.filter(item => item.status === activeStatusFilter);
  }, [activeStatusFilter, serviceData]);

  const filteredProductData = useMemo(() => {
    if (activeStatusFilter === 'all') return productData;
    return productData.filter(item => item.status === activeStatusFilter);
  }, [activeStatusFilter, productData]);


  return {
    activeTab,
    setActiveTab,
    activeStatusFilter,
    setActiveStatusFilter,
    isAdvancedSearchOpen,
    setIsAdvancedSearchOpen,
    filteredServiceData,
    filteredProductData,
    
    // Thêm các hàm CRUD và state Modal
    handleDelete,
    handleOpenFormModal,
    handleSave,
    isFormModalOpen,
    setIsFormModalOpen,
    editingItem,
  };
}