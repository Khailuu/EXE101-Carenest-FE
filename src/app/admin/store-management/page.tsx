// src/app/admin/store-management/page.tsx

"use client";

import { useState, JSX } from 'react';
import { Card, Table, Input, Button, Tag, Avatar, Popconfirm, Select, Row, Col, message, Tooltip, Modal, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined, LockOutlined, UnlockOutlined, CheckCircleOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, BankOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../components/AdminLayout'; 

const { Option } = Select;

type StoreStatus = 'Hoạt động' | 'Tạm khóa' | 'Chờ duyệt';

interface StoreData {
    key: string;
    logo: string;
    name: string;
    owner: string;
    email: string;
    branchCount: number;
    status: StoreStatus;
    registeredDate: string;
    phone: string;
    serviceDescription: string;
    workingHours: string; // THÔNG TIN MỚI
    bankInfo: string; // THÔNG TIN MỚI
}

const initialStoreData: StoreData[] = [
    { 
        key: '1', 
        logo: 'https://i.pravatar.cc/150?img=1', 
        name: 'Pet Shop Sài Gòn', 
        owner: 'Nguyễn Văn A', 
        email: 'storeA@email.com', 
        branchCount: 2, 
        status: 'Hoạt động', 
        registeredDate: '10/05/2023', 
        phone: '0901112233', 
        serviceDescription: 'Chăm sóc thú cưng cao cấp tại Sài Gòn', 
        workingHours: 'T2-T6: 8:00-18:00', 
        bankInfo: 'Vietcombank - ****1234' 
    },
    { 
        key: '2', 
        logo: 'https://i.pravatar.cc/150?img=2', 
        name: 'Happy Pet Care', 
        owner: 'Trần Thị B', 
        email: 'storeB@email.com', 
        branchCount: 1, 
        status: 'Hoạt động', 
        registeredDate: '20/06/2023', 
        phone: '0904445566', 
        serviceDescription: 'Dịch vụ spa và Grooming', 
        workingHours: '9:00 - 20:00', 
        bankInfo: 'ACB - ****4321' 
    },
    { 
        key: '3', 
        logo: 'https://i.pravatar.cc/150?img=3', 
        name: 'Dog & Cat Spa', 
        owner: 'Lê Văn C', 
        email: 'storeC@email.com', 
        branchCount: 3, 
        status: 'Tạm khóa', 
        registeredDate: '01/08/2023', 
        phone: '0907778899', 
        serviceDescription: 'Chuyên cung cấp thức ăn nhập khẩu', 
        workingHours: 'Cả ngày', 
        bankInfo: 'BIDV - ****5678' 
    },
    { 
        key: '4', 
        logo: 'https://i.pravatar.cc/150?img=4', 
        name: 'Cute Pet Shop', 
        owner: 'Phạm Thị D', 
        email: 'storeD@email.com', 
        branchCount: 1, 
        status: 'Chờ duyệt', 
        registeredDate: '05/09/2023', 
        phone: '0909990000', 
        serviceDescription: 'Mô tả dịch vụ đang chờ duyệt', 
        workingHours: 'Đang cập nhật', 
        bankInfo: 'Chưa cập nhật' 
    },
];

const renderStatusTag = (status: StoreStatus): JSX.Element => {
    switch (status) {
        case 'Hoạt động': return <Tag color="success" style={{ fontWeight: 'bold' }}>{status}</Tag>;
        case 'Tạm khóa': return <Tag color="error" style={{ fontWeight: 'bold' }}>{status}</Tag>;
        case 'Chờ duyệt': return <Tag color="processing" style={{ fontWeight: 'bold' }}>{status}</Tag>;
        default: return <Tag>{status}</Tag>;
    }
};

export default function StoreManagementPage(): JSX.Element {
    const [storeData, setStoreData] = useState<StoreData[]>(initialStoreData);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

    const handleViewDetails = (store: StoreData) => {
        setSelectedStore(store);
        setIsDetailModalVisible(true);
    };

    const handleLockToggle = (record: StoreData) => {
        const newStatus: StoreStatus = record.status === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động';
        setStoreData(prev => prev.map(s => 
            s.key === record.key ? { ...s, status: newStatus } : s
        ));
        message.success(`Đã ${newStatus === 'Tạm khóa' ? 'khóa' : 'mở khóa'} cửa hàng ${record.name}`);
        setIsDetailModalVisible(false);
    };
    
    const handleApprove = (record: StoreData) => {
        setStoreData(prev => prev.map(s => 
            s.key === record.key ? { ...s, status: 'Hoạt động' } : s
        ));
        message.success(`Đã phê duyệt cửa hàng ${record.name} thành công!`);
        setIsDetailModalVisible(false);
    };

    const storeColumns: ColumnsType<StoreData> = [
        { 
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (url: string) => <Avatar size="large" src={url} />,
            width: 80,
            align: 'center'
        },
        { title: 'Tên cửa hàng', dataIndex: 'name', key: 'name', width: 180, 
          render: (text: string) => <span className="font-medium text-gray-700">{text}</span> 
        },
        { title: 'Chủ sở hữu', dataIndex: 'owner', key: 'owner', width: 120 },
        { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
        { 
            title: <><BankOutlined /> Ngân hàng</>, 
            dataIndex: 'bankInfo', 
            key: 'bankInfo', 
            width: 150,
            render: (text: string) => <div className="text-sm">{text}</div> // Cột mới
        },
        { 
            title: <><ClockCircleOutlined /> Ngày làm việc</>, 
            dataIndex: 'workingHours', 
            key: 'workingHours', 
            width: 150,
            render: (text: string) => <div className="text-sm text-gray-600">{text}</div> // Cột mới
        },
        { title: 'Chi nhánh', dataIndex: 'branchCount', key: 'branchCount', width: 100, align: 'center' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: renderStatusTag, width: 120, align: 'center' },
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
              {/* Nút phê duyệt nhanh chỉ cho trạng thái Chờ duyệt */}
              {record.status === 'Chờ duyệt' && (
                <Popconfirm
                    title={`Xác nhận Phê duyệt cửa hàng ${record.name}?`}
                    onConfirm={() => handleApprove(record)}
                    okText="Phê duyệt"
                    cancelText="Hủy"
                >
                    <Tooltip title="Phê duyệt">
                        <Button type="text" icon={<CheckCircleOutlined className="text-green-500" />} />
                    </Tooltip>
                </Popconfirm>
              )}
              {/* Nút khóa/mở khóa nhanh */}
              {(record.status === 'Hoạt động' || record.status === 'Tạm khóa') && (
                <Popconfirm
                    title={`Xác nhận ${record.status === 'Hoạt động' ? 'KHÓA' : 'MỞ KHÓA'} cửa hàng ${record.name}?`}
                    onConfirm={() => handleLockToggle(record)}
                    okText={record.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                    cancelText="Hủy"
                    okButtonProps={{ danger: record.status === 'Hoạt động' }}
                >
                    <Button 
                        type="text" 
                        icon={record.status === 'Hoạt động' ? <LockOutlined className="text-red-500" /> : <UnlockOutlined className="text-green-500" />} 
                    />
                </Popconfirm>
              )}
            </div>
          ),
          width: 100,
          align: 'center'
        },
    ];

    const filteredStoreData = storeData.filter(s => selectedStatus === 'all' || s.status === selectedStatus);

    const statusCounts = storeData.reduce((acc, store) => {
        acc[store.status] = (acc[store.status] || 0) + 1;
        return acc;
    }, {} as Record<StoreStatus, number>);

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Quản lý cửa hàng</h1>
            
            {/* Filter and Search Section */}
            <Card bordered={false} className="shadow-lg mb-6 p-2">
                <Row gutter={16} align="middle">
                    <Col xs={24} lg={8}>
                        <Input
                            placeholder="Tìm kiếm cửa hàng..."
                            size="large"
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col xs={12} lg={4}>
                        <Button
                            size="large"
                            className="w-full bg-blue-500 text-white border-blue-500 hover:!bg-blue-600 hover:!text-white"
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                    <Col xs={12} lg={12} className="flex justify-end space-x-2">
                        {/* Tabs tương ứng với thiết kế */}
                        <Button 
                            type={selectedStatus === 'all' ? 'primary' : 'default'} 
                            onClick={() => setSelectedStatus('all')}
                            className={selectedStatus !== 'all' ? 'text-gray-600 !ml-[10px]' : '!ml-[10px] ]bg-green-600 border-green-600'}
                        >
                            Tất cả ({storeData.length})
                        </Button>
                         <Button 
                            type={selectedStatus === 'Chờ duyệt' ? 'primary' : 'default'} 
                            onClick={() => setSelectedStatus('Chờ duyệt')}
                            className={selectedStatus !== 'Chờ duyệt' ? 'text-gray-600 !ml-[10px]' : '!ml-[10px] ]bg-yellow-600 border-yellow-600'}
                        >
                            Chờ duyệt ({statusCounts['Chờ duyệt'] || 0})
                        </Button>
                        <Button 
                            type={selectedStatus === 'Hoạt động' ? 'primary' : 'default'} 
                            onClick={() => setSelectedStatus('Hoạt động')}
                            className={selectedStatus !== 'Hoạt động' ? 'text-gray-600 !ml-[10px]' : '!ml-[10px] ]bg-green-600 border-green-600'}
                        >
                            Hoạt động ({statusCounts['Hoạt động'] || 0})
                        </Button>
                         <Button 
                            type={selectedStatus === 'Tạm khóa' ? 'primary' : 'default'} 
                            onClick={() => setSelectedStatus('Tạm khóa')}
                            className={selectedStatus !== 'Tạm khóa' ? 'text-gray-600 !ml-[10px]' : '!ml-[10px] ]bg-red-600 border-red-600'}
                        >
                            Tạm khóa ({statusCounts['Tạm khóa'] || 0})
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Store Table */}
            <Table
                columns={storeColumns}
                dataSource={filteredStoreData}
                pagination={{ pageSize: 10 }}
                bordered
                className="rounded-lg overflow-hidden shadow-lg"
                scroll={{ x: 1600 }} // Tăng scrollX để phù hợp với cột mới
                footer={() => (
                    <div className="text-gray-600 font-semibold">
                        Tổng: {filteredStoreData.length} cửa hàng
                    </div>
                )}
            />

             {/* Modal Xem chi tiết cửa hàng (Giữ nguyên) */}
            <Modal
                title={`Chi tiết cửa hàng: ${selectedStore?.name}`}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsDetailModalVisible(false)}>
                        Đóng
                    </Button>,
                    // Nút Phê duyệt (chỉ hiện khi status là Chờ duyệt)
                    selectedStore?.status === 'Chờ duyệt' && (
                        <Popconfirm
                            key="approve-confirm"
                            title={`Xác nhận Phê duyệt cửa hàng ${selectedStore?.name}?`}
                            onConfirm={() => selectedStore && handleApprove(selectedStore)}
                            okText="Phê duyệt"
                            cancelText="Hủy"
                        >
                            <Button key="approve" type="primary" icon={<CheckCircleOutlined />} className="bg-green-500 border-green-500">
                                Phê duyệt
                            </Button>
                        </Popconfirm>
                    ),
                    // Nút Khóa/Mở khóa
                    (selectedStore?.status === 'Hoạt động' || selectedStore?.status === 'Tạm khóa') && (
                        <Popconfirm
                            key="lock-toggle-confirm"
                            title={`Xác nhận ${selectedStore?.status === 'Hoạt động' ? 'KHÓA' : 'MỞ KHÓA'} cửa hàng ${selectedStore?.name}?`}
                            onConfirm={() => selectedStore && handleLockToggle(selectedStore)}
                            okText={selectedStore?.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                            cancelText="Hủy"
                            okButtonProps={{ danger: selectedStore?.status === 'Hoạt động' }}
                        >
                            <Button 
                                key="lock-toggle" 
                                type={selectedStore?.status === 'Hoạt động' ? 'primary' : 'default'} 
                                danger={selectedStore?.status === 'Hoạt động'}
                                icon={selectedStore?.status === 'Hoạt động' ? <LockOutlined /> : <UnlockOutlined />}
                            >
                                {selectedStore?.status === 'Hoạt động' ? 'Khóa Tài Khoản' : 'Mở Khóa Tài Khoản'}
                            </Button>
                        </Popconfirm>
                    ),
                ]}
            >
                {selectedStore && (
                    <div className="text-center mb-6">
                        <Avatar size={80} src={selectedStore.logo} className="mb-2" />
                        <h3 className="font-bold text-lg">{selectedStore.name}</h3>
                        {renderStatusTag(selectedStore.status)}
                    </div>
                )}

                <Descriptions bordered column={1} size="small" className="mt-4">
                    <Descriptions.Item label={<span className="font-medium"><HomeOutlined /> Tên cửa hàng</span>}>{selectedStore?.name}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium">Chủ sở hữu</span>}>{selectedStore?.owner}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><MailOutlined /> Email liên hệ</span>}>{selectedStore?.email}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><PhoneOutlined /> Điện thoại</span>}>{selectedStore?.phone}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium">Số chi nhánh</span>}>{selectedStore?.branchCount}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><CalendarOutlined /> Ngày đăng ký</span>}>{selectedStore?.registeredDate}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><BankOutlined /> Ngân hàng</span>}>{selectedStore?.bankInfo}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><ClockCircleOutlined /> Giờ làm việc</span>}>{selectedStore?.workingHours}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium">Mô tả dịch vụ</span>}>{selectedStore?.serviceDescription}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </AdminLayout>
    );
}