import React, { useMemo, useState } from "react";
import { Tag, message, Form } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";

// --- TYPE DEFINITIONS ---
export interface Service {
  name: string;
  note: string;
  price: number;
}

export interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface OrderBase {
  key: string;
  stt: number;
  customer: string;
  phone: string;
  address: string;
  total: number;
  status: 'processing' | 'completed' | 'cancelled' | 'pending';
}

export interface ServiceOrder extends OrderBase {
  staffId: string;
  services: Service[];
  startTime: string;
  endTime: string;
  branch: string;
}

export interface ProductOrder extends OrderBase {
  products: Product[];
  shippingFee: number;
  expectedDelivery: string;
}

export type TabType = 'service' | 'product';
export type StatusType = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';
export type OrderType = ServiceOrder | ProductOrder;
export type ModalType = 'details' | 'confirm_service' | 'cancel_service' | null;

// --- MOCK DATA ---
const mockServiceOrders: ServiceOrder[] = [
  {
    key: "1", stt: 1, customer: "Nguyễn Văn A", phone: "0919.111.222", address: "Đại học fpt...",
    services: [{ name: "Dịch vụ tắm cho cún", note: "Cún bị dị ứng nước", price: 200000 }],
    startTime: "2025-01-01 9:00", endTime: "2025-01-01 12:00", branch: "Vinhome Grand Park", total: 200000, status: "pending",
    staffId: ""
  },
  {
    key: "2", stt: 2, customer: "Trần Thị B", phone: "0919.222.333", address: "Quận 1, TPHCM",
    services: [{ name: "Cắt tỉa lông", note: "Tạo kiểu xù", price: 350000 }],
    startTime: "2025-01-02 10:00", endTime: "2025-01-02 11:30", branch: "Chi nhánh Gò Vấp", total: 350000, status: "processing",
    staffId: ""
  },
  {
    key: "3", stt: 3, customer: "Lê Văn C", phone: "0919.333.444", address: "Quận 7, TPHCM",
    services: [{ name: "Tiêm ngừa dại", note: "Mũi 1", price: 150000 }],
    startTime: "2025-01-03 14:00", endTime: "2025-01-03 14:30", branch: "Vinhome Grand Park", total: 150000, status: "completed", staffId: ""
  },
  {
    key: "4", stt: 4, customer: "Phạm D", phone: "0919.444.555", address: "Quận 9, TPHCM",
    services: [{ name: "Kiểm tra sức khỏe", note: "-", price: 50000 }],
    startTime: "2025-01-04 16:00", endTime: "2025-01-04 17:00", branch: "Chi nhánh Gò Vấp", total: 50000, status: "cancelled", staffId: ""
  },
];

const mockProductOrders: ProductOrder[] = [
  {
    key: "1", stt: 1, customer: "Nguyễn Văn E", phone: "0919.111.222", address: "Đại học fpt...",
    products: [{ name: "Thức ăn hạt cao cấp", quantity: 1, price: 500000 }],
    total: 500000, status: "pending", shippingFee: 20000, expectedDelivery: "2025-01-05"
  },
  {
    key: "2", stt: 2, customer: "Trần Thị F", phone: "0919.222.333", address: "Quận 1, TPHCM",
    products: [{ name: "Vòng cổ chống ve", quantity: 2, price: 150000 }],
    total: 300000, status: "processing", shippingFee: 15000, expectedDelivery: "2025-01-04"
  },
  {
    key: "3", stt: 3, customer: "Lê Văn G", phone: "0919.333.444", address: "Quận 7, TPHCM",
    products: [{ name: "Đồ chơi gặm nhai", quantity: 1, price: 80000 }, { name: "Thức ăn ướt", quantity: 5, price: 50000 }],
    total: 330000, status: "completed", shippingFee: 25000, expectedDelivery: "2025-01-03"
  },
];

export const mockStaff = [
    { id: 'STF001', name: 'Vũ Hoàng Trung' },
    { id: 'STF002', name: 'Nguyễn Đình Nam' },
    { id: 'STF003', name: 'Trần Thị Thu' },
];

// --- HELPER FUNCTIONS ---
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

export const getStatusConfig = (status: ServiceOrder['status'] | ProductOrder['status']) => {
  switch (status) {
    case 'processing': return { color: "blue", text: "Đang xử lý", icon: <SyncOutlined spin /> };
    case 'completed': return { color: "green", text: "Hoàn thành", icon: <CheckCircleOutlined /> };
    case 'cancelled': return { color: "red", text: "Đã hủy", icon: <CloseCircleOutlined /> };
    case 'pending':
    default: return { color: "orange", text: "Chờ xác nhận", icon: <ClockCircleOutlined /> };
  }
};

export const renderStatusTag = (status: ServiceOrder['status'] | ProductOrder['status']): React.ReactElement => {
  const config = getStatusConfig(status);
  return <Tag icon={config.icon} color={config.color} className="font-semibold">{config.text}</Tag>;
};

export const statusButtons = [
  { key: 'all', text: 'Tất cả', color: 'gray' },
  { key: 'pending', text: 'Chờ xác nhận', color: 'orange' },
  { key: 'processing', text: 'Đang xử lý', color: 'blue' },
  { key: 'completed', text: 'Hoàn thành', color: 'green' },
  { key: 'cancelled', text: 'Đơn Hủy', color: 'red' },
];

// --- HOOK CHÍNH ---
export function useOrderData() {
  const [activeStatus, setActiveStatus] = useState<StatusType>("pending");
  const [activeTab, setActiveTab] = useState<TabType>("service");
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(mockServiceOrders);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>(mockProductOrders);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderType | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [form] = Form.useForm();


  // Logic lọc
  const filteredServiceOrders = useMemo(() => {
    if (activeStatus === 'all') return serviceOrders;
    return serviceOrders.filter(order => order.status === activeStatus);
  }, [activeStatus, serviceOrders]);

  const filteredProductOrders = useMemo(() => {
    if (activeStatus === 'all') return productOrders;
    return productOrders.filter(order => order.status === activeStatus);
  }, [activeStatus, productOrders]);
  
  // --- HÀM XỬ LÝ ACTION ---
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOrder(null);
    setModalType(null);
    form.resetFields();
  };
  
  // 1. Mở Modal Xem chi tiết (Cho cả Dịch vụ và Sản phẩm)
  const openDetailsModal = (order: OrderType) => {
      setCurrentOrder(order);
      setModalType('details');
      setIsModalOpen(true);
  };
  
  // 2. Mở Modal Xác nhận Dịch vụ
  const openConfirmServiceModal = (order: ServiceOrder) => {
      setCurrentOrder(order);
      setModalType('confirm_service');
      setIsModalOpen(true);
  };
  
  // 3. Mở Modal Hủy Dịch vụ
  const openCancelServiceModal = (order: ServiceOrder) => {
      setCurrentOrder(order);
      setModalType('cancel_service');
      setIsModalOpen(true);
      form.resetFields();
  };
  
  // 4. Xử lý Gửi Modal (Xác nhận/Hủy Dịch vụ)
  const handleServiceAction = async (values: { staffId?: string, reason?: string, newStatus: 'processing' | 'cancelled' }) => {
    if (!currentOrder || currentOrder.key.startsWith('SP')) return; 

    // Logic Cập nhật data
    const updatedOrders = serviceOrders.map(o => 
        o.key === currentOrder.key
            ? { 
                ...(o as ServiceOrder), 
                status: values.newStatus,
                // Giả lập cập nhật nhân viên (nếu xác nhận)
                // Giả lập cập nhật ghi chú (nếu hủy)
              }
            : o
    );
    
    setServiceOrders(updatedOrders as ServiceOrder[]);
    closeModal();
    message.success(values.newStatus === 'processing' ? `Đã xác nhận lịch hẹn SV${currentOrder.key}!` : `Đã hủy đơn SV${currentOrder.key}.`);
  };


  return {
    // State
    activeTab, setActiveTab,
    activeStatus, setActiveStatus,
    isModalOpen, currentOrder, modalType, form,
    
    // Data
    filteredServiceOrders,
    filteredProductOrders,
    statusButtons,
    mockStaff,
    
    // Actions
    openDetailsModal,
    openConfirmServiceModal,
    openCancelServiceModal,
    handleServiceAction,
    closeModal,
  };
}