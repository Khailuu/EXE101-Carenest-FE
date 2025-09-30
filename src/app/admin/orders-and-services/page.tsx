"use client";

import { useState, JSX } from 'react';
import { Card, Table, Input, Button, Tag, Row, Col, Select, DatePicker, message, Tooltip, Modal, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, DollarCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../components/AdminLayout'; 
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

type OrderStatus = 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang tiến hành' | 'Hoàn thành' | 'Hủy bỏ' | 'Tranh chấp';

interface OrderData {
    key: string;
    code: string;
    customer: string;
    store: string;
    service: string;
    time: string;
    status: OrderStatus;
    total: number;
    commission: number;
}

// Dữ liệu mẫu đã được làm phong phú hơn
const initialOrderData: OrderData[] = [
    { key: '1', code: 'AP001', customer: 'Huỳnh Gia Bảo', store: 'HappyPet', service: 'Tắm gội + cắt tỉa lông', time: '14:30 - 25/06/2025', status: 'Chờ xác nhận', total: 150000, commission: 15 },
    { key: '2', code: 'AP002', customer: 'Nguyễn Văn Đạt', store: 'Pet Shop Sài Gòn', service: 'Spa thư giãn', time: '09:00 - 26/06/2025', status: 'Hoàn thành', total: 300000, commission: 10 },
    { key: '3', code: 'AP003', customer: 'Trần Thị Thu', store: 'Dog & Cat Spa', service: 'Huấn luyện cơ bản', time: '16:00 - 27/06/2025', status: 'Tranh chấp', total: 500000, commission: 20 },
    { key: '4', code: 'AP004', customer: 'Lê Văn Khang', store: 'HappyPet', service: 'Cắt móng & vệ sinh tai', time: '10:00 - 28/06/2025', status: 'Đang tiến hành', total: 80000, commission: 15 },
    { key: '5', code: 'AP005', customer: 'Phạm Thị Yến', store: 'Pet Shop Sài Gòn', service: 'Tiêm phòng định kỳ', time: '11:00 - 29/06/2025', status: 'Đã xác nhận', total: 400000, commission: 10 },
    { key: '6', code: 'AP006', customer: 'Vũ Thanh Mai', store: 'Cute Pet Shop', service: 'Khám sức khỏe', time: '15:00 - 30/06/2025', status: 'Hủy bỏ', total: 200000, commission: 12 },
];

const OrderStatusColors: Record<OrderStatus, string> = {
    'Chờ xác nhận': 'processing',
    'Đã xác nhận': 'blue',
    'Đang tiến hành': 'gold',
    'Hoàn thành': 'success',
    'Hủy bỏ': 'error',
    'Tranh chấp': 'warning',
};

const renderStatusTag = (status: OrderStatus): JSX.Element => (
    <Tag color={OrderStatusColors[status]} style={{ fontWeight: 'bold' }}>
        {status}
    </Tag>
);

// Dữ liệu thống kê (Giả định dựa trên Screenshot 2025-09-29 at 20.40.59.png)
const statsData = {
    totalToday: 45,
    pending: 12,
    inProgress: 8,
    completed: 156,
    revenueToday: 2450000,
    commissionToday: 367500,
    revenueMonth: 45650000,
    commissionMonth: 6847500,
    totalCompletedOrders: 1123
};

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number): string => `${amount.toLocaleString()}₫`;

export default function OrdersAndServicesPage(): JSX.Element {
    const [orderData, setOrderData] = useState<OrderData[]>(initialOrderData);
    const [selectedStatusTab, setSelectedStatusTab] = useState('Tất cả');
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

    const handleViewDetails = (order: OrderData) => {
        setSelectedOrder(order);
        setIsDetailModalVisible(true);
    };
    
    // Tính tổng số lượng cho mỗi trạng thái để hiển thị trên tabs
    const statusCounts = orderData.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<OrderStatus, number>);

    // Dữ liệu được lọc theo tab
    const filteredOrderData = selectedStatusTab === 'Tất cả'
        ? orderData
        : orderData.filter(o => o.status === selectedStatusTab);

    const orderColumns: ColumnsType<OrderData> = [
        { title: 'Mã đặt lịch', dataIndex: 'code', key: 'code', width: 100 },
        { title: 'Khách hàng', dataIndex: 'customer', key: 'customer', width: 150 },
        { title: 'Cửa hàng', dataIndex: 'store', key: 'store', width: 150 },
        { title: 'Dịch vụ', dataIndex: 'service', key: 'service', width: 150 },
        { title: 'Thời gian', dataIndex: 'time', key: 'time', width: 180 },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: renderStatusTag, width: 120, align: 'center' },
        { title: 'Tổng tiền', dataIndex: 'total', key: 'total', width: 100, align: 'right', render: formatCurrency },
        { title: 'Hoa hồng', dataIndex: 'commission', key: 'commission', width: 100, align: 'center', render: (c: number) => `${c}%` },
        {
          title: 'Thao tác',
          key: 'action',
          render: (_, record) => (
            <div className="flex gap-2 justify-center">
              <Tooltip title="Xem chi tiết">
                <Button 
                    type="text" 
                    icon={<EyeOutlined className="text-blue-500" />} 
                    onClick={() => handleViewDetails(record)}
                />
              </Tooltip>
            </div>
          ),
          width: 80,
          align: 'center'
        },
    ];

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Quản lý dịch vụ và lịch hẹn</h1>
            
            {/* Filter, Search và Date Picker */}
            <Card bordered={false} className="shadow-lg mb-6 p-4 bg-[#4A3837]"> 
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} lg={12}>
                        <Input
                            placeholder="Tìm kiếm theo tên khách hàng, cửa hàng..."
                            size="large"
                            prefix={<SearchOutlined className="text-gray-500" />}
                            className="bg-white border-none"
                        />
                    </Col>
                    <Col xs={12} lg={4}>
                        <DatePicker placeholder="Từ ngày" size="large" className="w-full" />
                    </Col>
                    <Col xs={12} lg={4}>
                         <DatePicker placeholder="Đến ngày" size="large" className="w-full" />
                    </Col>
                    <Col xs={24} lg={4}>
                        <Button
                            size="large"
                            className="w-full bg-[#8B6E5A] text-white border-none hover:!bg-[#A38A73]"
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Thống kê nhanh theo thiết kế */}
            <Row gutter={[16, 16]} className="mb-6 !mt-[30px]">
                <Col xs={12} lg={3}>
                    <Card className="bg-[#4A3837] text-white text-center shadow-lg">
                        <div className="text-2xl font-bold">{statsData.totalToday}</div>
                        <div className="text-xs text-gray-400">Tổng cuộc hẹn hôm nay</div>
                    </Card>
                </Col>
                <Col xs={12} lg={3}>
                    <Card className="bg-[#4A3837] text-white text-center shadow-lg">
                        <div className="text-2xl font-bold">{statsData.pending}</div>
                        <div className="text-xs text-gray-400">Chờ xác nhận</div>
                    </Card>
                </Col>
                <Col xs={12} lg={3}>
                    <Card className="bg-[#4A3837] text-white text-center shadow-lg">
                        <div className="text-2xl font-bold">{statsData.inProgress}</div>
                        <div className="text-xs text-gray-400">Đang tiến hành</div>
                    </Card>
                </Col>
                <Col xs={12} lg={3}>
                    <Card className="bg-[#4A3837] text-white text-center shadow-lg">
                        <div className="text-2xl font-bold">{statsData.completed}</div>
                        <div className="text-xs text-gray-400">Hoàn thành</div>
                    </Card>
                </Col>
                <Col xs={24} lg={6}>
                    <Card className="bg-[#4A3837] text-white shadow-lg">
                        <div className="text-sm text-gray-400">Doanh thu hàng ngày</div>
                        <div className="text-2xl font-bold text-[#E8D1A3]">{formatCurrency(statsData.revenueToday)}</div>
                        <div className="text-xs text-gray-400">Hoa hồng hôm nay: {formatCurrency(statsData.commissionToday)}</div>
                    </Card>
                </Col>
                <Col xs={24} lg={6}>
                    <Card className="bg-[#4A3837] text-white shadow-lg">
                        <div className="text-sm text-gray-400">Doanh thu tháng này</div>
                        <div className="text-2xl font-bold text-[#E8D1A3]">{formatCurrency(statsData.revenueMonth)}</div>
                        <div className="text-xs text-gray-400">Hoa hồng tháng này: {formatCurrency(statsData.commissionMonth)}</div>
                    </Card>
                </Col>
            </Row>

            {/* Tabs Trạng thái */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                {['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang tiến hành', 'Hoàn thành', 'Hủy bỏ', 'Tranh chấp'].map(status => (
                    <Button
                        key={status}
                        type={selectedStatusTab === status ? 'primary' : 'default'}
                        onClick={() => setSelectedStatusTab(status)}
                        className={`font-semibold min-w-[120px] ${selectedStatusTab === status ? 'bg-[#8B6E5A] border-[#8B6E5A] text-white !ml-[10px]' : '!ml-[10px] text-gray-700 bg-gray-100 hover:!bg-gray-200'}`}
                    >
                        {status} ({status === 'Tất cả' ? orderData.length : statusCounts[status as OrderStatus] || 0})
                    </Button>
                ))}
            </div>

            {/* Order Table */}
            <Card className="shadow-lg p-0">
                <Table
                    columns={orderColumns}
                    dataSource={filteredOrderData}
                    pagination={{ pageSize: 10 }}
                    bordered
                    className="rounded-lg overflow-hidden"
                    scroll={{ x: 1200 }}
                    footer={() => (
                        <div className="text-gray-600 font-semibold">
                            Tổng: {filteredOrderData.length} cuộc hẹn
                        </div>
                    )}
                />
            </Card>

            {/* Modal Xem chi tiết cuộc hẹn */}
            <Modal
                title={`Chi tiết cuộc hẹn: ${selectedOrder?.code}`}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsDetailModalVisible(false)} type="primary" className="bg-gray-700 hover:!bg-gray-600 border-none">
                        Đóng
                    </Button>,
                ]}
            >
                {selectedOrder && (
                    <Descriptions bordered column={1} size="small" className="mt-4">
                        <Descriptions.Item label="Mã đặt lịch" labelStyle={{ fontWeight: 'bold' }}>{selectedOrder.code}</Descriptions.Item>
                        <Descriptions.Item label="Khách hàng" labelStyle={{ fontWeight: 'bold' }}>{selectedOrder.customer}</Descriptions.Item>
                        <Descriptions.Item label="Cửa hàng" labelStyle={{ fontWeight: 'bold' }}>{selectedOrder.store}</Descriptions.Item>
                        <Descriptions.Item label="Dịch vụ" labelStyle={{ fontWeight: 'bold' }}>{selectedOrder.service}</Descriptions.Item>
                        <Descriptions.Item label="Thời gian" labelStyle={{ fontWeight: 'bold' }}>{selectedOrder.time}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái" labelStyle={{ fontWeight: 'bold' }}>{renderStatusTag(selectedOrder.status)}</Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền" labelStyle={{ fontWeight: 'bold' }}>{formatCurrency(selectedOrder.total)}</Descriptions.Item>
                        <Descriptions.Item label="Hoa hồng" labelStyle={{ fontWeight: 'bold' }}>{selectedOrder.commission}%</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </AdminLayout>
    );
}