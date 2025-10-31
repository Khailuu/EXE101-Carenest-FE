"use client";

import { useState, JSX, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Avatar, Popconfirm, Select, Row, Col, message, Tooltip, Modal, Descriptions, Spin } from 'antd';
import { SearchOutlined, EyeOutlined, LockOutlined, UnlockOutlined, CheckCircleOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, BankOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../components/AdminLayout'; 
import { shopsApi } from '@/constants/api'; 

interface ApiStoreData {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    status: number;
    imgUrl: string;
    workingDays: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    bankCode: string;
    note: string;
}

type StoreStatus = 'Hoạt động' | 'Tạm khóa' | 'Chờ duyệt';

interface StoreData {
    key: string;
    id: string;
    logo: string;
    name: string;
    ownerId: string;
    description: string;
    status: StoreStatus;
    workingDays: string;
    bankInfo: string;
    note: string;
}

const renderStatusTag = (status: StoreStatus): JSX.Element => {
    switch (status) {
        case 'Hoạt động': return <Tag color="success" style={{ fontWeight: 'bold' }}>{status}</Tag>;
        case 'Tạm khóa': return <Tag color="error" style={{ fontWeight: 'bold' }}>{status}</Tag>;
        case 'Chờ duyệt': return <Tag color="processing" style={{ fontWeight: 'bold' }}>{status}</Tag>;
        default: return <Tag>{status}</Tag>;
    }
};

export default function StoreManagementPage(): JSX.Element {
    const [storeData, setStoreData] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await shopsApi.get('/shop', {
                    params: { pageIndex: 1, pageSize: 10, sortDirection: 'asc' }
                });
                const apiData: ApiStoreData[] = response.data.data.items;
                const mappedData: StoreData[] = apiData.map(store => ({
                    key: store.id,
                    id: store.id,
                    logo: store.imgUrl,
                    name: store.name,
                    ownerId: store.ownerId,
                    description: store.description,
                    status: store.status === 1 ? 'Hoạt động' : 'Tạm khóa',
                    workingDays: store.workingDays,
                    bankInfo: `${store.bankName} - ${store.bankAccountNumber}`,
                    note: store.note
                }));
                setStoreData(mappedData);
            } catch (error) {
                console.error('Failed to fetch stores:', error);
                message.error('Không thể tải danh sách cửa hàng');
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

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
        { title: 'Chủ sở hữu ID', dataIndex: 'ownerId', key: 'ownerId', width: 120 },
        { 
            title: 'Mô tả', 
            dataIndex: 'description', 
            key: 'description', 
            width: 200,
            render: (text: string) => <div className="text-sm text-gray-600">{text}</div>
        },
        { 
            title: <><BankOutlined /> Ngân hàng</>, 
            dataIndex: 'bankInfo', 
            key: 'bankInfo', 
            width: 200,
            render: (text: string) => <div className="text-sm">{text}</div>
        },
        { 
            title: <><ClockCircleOutlined /> Ngày làm việc</>, 
            dataIndex: 'workingDays', 
            key: 'workingDays', 
            width: 150,
            render: (text: string) => <div className="text-sm text-gray-600">{text}</div>
        },
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
                            className="w-full bg-blue-500 text-white border-blue-500 hover:bg-blue-600! hover:text-white!"
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                    <Col xs={12} lg={12} className="flex justify-end space-x-2">
                        {/* Tabs tương ứng với thiết kế */}
                        <Button 
                            type={selectedStatus === 'all' ? 'primary' : 'default'} 
                            onClick={() => setSelectedStatus('all')}
                            className={selectedStatus !== 'all' ? 'text-gray-600 ml-2.5!' : 'ml-2.5! bg-green-600 border-green-600'}
                        >
                            Tất cả ({storeData.length})
                        </Button>
                         <Button 
                            type={selectedStatus === 'Chờ duyệt' ? 'primary' : 'default'} 
                            onClick={() => setSelectedStatus('Chờ duyệt')}
                            className={selectedStatus !== 'Chờ duyệt' ? 'text-gray-600 ml-2.5!' : 'ml-2.5! bg-yellow-600 border-yellow-600'}
                        >
                            Chờ duyệt ({statusCounts['Chờ duyệt'] || 0})
                        </Button>
                        <Button 
                            type={selectedStatus === 'Hoạt động' ? 'primary' : 'default'} 
                            onClick={() => setSelectedStatus('Hoạt động')}
                            className={selectedStatus !== 'Hoạt động' ? 'text-gray-600 ml-2.5!' : 'ml-2.5! bg-green-600 border-green-600'}
                        >
                            Hoạt động ({statusCounts['Hoạt động'] || 0})
                        </Button>
                         <Button 
                            type={selectedStatus === 'Tạm khóa' ? 'primary' : 'default'} 
                            onClick={() => setSelectedStatus('Tạm khóa')}
                            className={selectedStatus !== 'Tạm khóa' ? 'text-gray-600 ml-2.5!' : 'ml-2.5! bg-red-600 border-red-600'}
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
                    <Descriptions.Item label={<span className="font-medium">ID cửa hàng</span>}>{selectedStore?.id}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium">Chủ sở hữu ID</span>}>{selectedStore?.ownerId}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium">Mô tả</span>}>{selectedStore?.description}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><BankOutlined /> Ngân hàng</span>}>{selectedStore?.bankInfo}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><ClockCircleOutlined /> Ngày làm việc</span>}>{selectedStore?.workingDays}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </AdminLayout>
    );
}