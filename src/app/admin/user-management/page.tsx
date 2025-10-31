"use client";

import { useState, JSX, useEffect } from 'react';
import { 
    Card, Table, Input, Button, Tag, Avatar, Popconfirm, Select, Row, Col, message, Tooltip, 
    Modal, Descriptions, Form, DatePicker, Spin
} from 'antd';
import { 
    SearchOutlined, EyeOutlined, LockOutlined, UnlockOutlined, 
    UserOutlined, MailOutlined, CalendarOutlined, PhoneOutlined, SafetyOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../components/AdminLayout'; 
import { authApi } from '@/constants/api';
import { apiInstance } from '@/constants/api'; 

const { Option } = Select;

interface ApiUserData {
    id: string;
    username: string;
    fullName: string | null;
    email: string;
    role: string;
    isActive: boolean;
    address: string;
}

type UserType = 'Khách hàng' | 'Hội viên' | 'Cửa hàng' | 'Admin' | 'Manager';
type UserStatus = 'Hoạt động' | 'Tạm khóa';

interface UserData {
    key: string;
    avatar: string;
    name: string;
    email: string;
    userType: UserType;
    status: UserStatus;
    registeredDate: string;
    phone: string;
    address: string;
}

const renderStatusTag = (status: UserStatus): JSX.Element => {
    switch (status) {
        case 'Hoạt động': return <Tag color="success" style={{ fontWeight: 'bold' }}>{status}</Tag>;
        case 'Tạm khóa': return <Tag color="error" style={{ fontWeight: 'bold' }}>{status}</Tag>;
        default: return <Tag>{status}</Tag>;
    }
};

const renderTypeTag = (type: UserType): JSX.Element => {
    switch (type) {
        case 'Khách hàng': return <Tag color="blue">{type}</Tag>;
        case 'Hội viên': return <Tag color="gold">{type}</Tag>;
        case 'Cửa hàng': return <Tag color="purple">{type}</Tag>;
        case 'Admin': return <Tag color="red">{type}</Tag>;
        case 'Manager': return <Tag color="orange">{type}</Tag>;
        default: return <Tag>{type}</Tag>;
    }
};

export default function UserManagementPage(): JSX.Element {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('all');
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const adminApi = apiInstance.create({ baseURL: process.env.NEXT_PUBLIC_MANAGE_AUTH_API });
                const response = await adminApi.get('/admin/accounts');
                const apiData: ApiUserData[] = response.data.data;
                const mappedData: UserData[] = apiData.map(user => ({
                    key: user.id,
                    avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 50), // Random avatar
                    name: user.username,
                    email: user.email,
                    userType: mapRoleToUserType(user.role),
                    status: user.isActive ? 'Hoạt động' : 'Tạm khóa',
                    registeredDate: '', // API không có
                    phone: '', // API không có
                    address: user.address
                }));
                setUserData(mappedData);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                message.error('Không thể tải danh sách người dùng');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const mapRoleToUserType = (role: string): UserType => {
        switch (role) {
            case 'ROLE_ADMIN': return 'Admin';
            case 'ROLE_MANAGER': return 'Manager';
            case 'ROLE_SHOP': return 'Cửa hàng';
            case 'ROLE_USER': return 'Khách hàng';
            default: return 'Khách hàng';
        }
    };

    const handleViewDetails = (user: UserData) => {
        setSelectedUser(user);
        setIsDetailModalVisible(true);
    };

    const handleLockToggle = (record: UserData) => {
        const newStatus: UserStatus = record.status === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động';
        setUserData(prev => prev.map(u => 
            u.key === record.key ? { ...u, status: newStatus } : u
        ));
        message.success(`Đã ${newStatus === 'Tạm khóa' ? 'khóa' : 'mở khóa'} tài khoản ${record.name}`);
        setIsDetailModalVisible(false); // Đóng modal nếu đang mở
    };

    const userColumns: ColumnsType<UserData> = [
        { 
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (url: string) => <Avatar size="large" src={url} />,
            width: 80,
            align: 'center'
        },
        { title: 'Tên', dataIndex: 'name', key: 'name', width: 180, 
          render: (text: string) => <span className="font-medium text-gray-700">{text}</span> 
        },
        { title: 'Email', dataIndex: 'email', key: 'email', width: 250 },
        { title: 'Loại tài khoản', dataIndex: 'userType', key: 'userType', render: renderTypeTag, width: 120 },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: renderStatusTag, width: 120, align: 'center' },
        { title: 'Ngày đăng ký', dataIndex: 'registeredDate', key: 'registeredDate', width: 120 },
        {
          title: 'Thao tác',
          key: 'action',
          render: (_, record) => (
            <div className="flex gap-2">
              <Tooltip title="Xem chi tiết">
                <Button 
                    type="text" 
                    icon={<EyeOutlined className="text-blue-500" />} 
                    onClick={() => handleViewDetails(record)}
                />
              </Tooltip>
              <Popconfirm
                title={`Xác nhận ${record.status === 'Hoạt động' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản ${record.name}?`}
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
            </div>
          ),
          width: 100,
          align: 'center'
        },
    ];

    const filteredUserData = userData.filter(u => 
        selectedType === 'all' || u.status === selectedType || u.userType === selectedType
    );

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Quản lý người dùng</h1>
            
            {/* Filter and Search Section */}
            <Card bordered={false} className="shadow-lg mb-6 p-2">
                <Row gutter={16} align="middle">
                    <Col xs={24} lg={8}>
                        <Input
                            placeholder="Tìm kiếm người dùng..."
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
                    <Col xs={12} lg={12} className="flex justify-end">
                        <Select
                            defaultValue="all"
                            style={{ width: 150 }}
                            size="large"
                            onChange={setSelectedType}
                        >
                            <Option value="all">Tất cả</Option>
                            <Option value="Hoạt động">Hoạt động</Option>
                            <Option value="Tạm khóa">Tạm khóa</Option>
                            <Option value="Admin">Admin</Option>
                            <Option value="Manager">Manager</Option>
                            <Option value="Khách hàng">Khách hàng</Option>
                            <Option value="Cửa hàng">Cửa hàng</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* User Table */}
            <Table
                columns={userColumns}
                dataSource={filteredUserData}
                pagination={{ pageSize: 10 }}
                bordered
                className="rounded-lg overflow-hidden shadow-lg"
                scroll={{ x: 1000 }}
                loading={loading}
                footer={() => (
                    <div className="text-gray-600 font-semibold">
                        Tổng: {filteredUserData.length} người dùng
                    </div>
                )}
            />

            {/* Modal Xem chi tiết người dùng */}
            <Modal
                title={`Chi tiết người dùng: ${selectedUser?.name}`}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsDetailModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Popconfirm
                        key="lock-toggle-confirm"
                        title={`Xác nhận ${selectedUser?.status === 'Hoạt động' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản ${selectedUser?.name}?`}
                        onConfirm={() => selectedUser && handleLockToggle(selectedUser)}
                        okText={selectedUser?.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                        cancelText="Hủy"
                        okButtonProps={{ danger: selectedUser?.status === 'Hoạt động' }}
                    >
                        <Button 
                            key="lock-toggle" 
                            type={selectedUser?.status === 'Hoạt động' ? 'primary' : 'default'} 
                            danger={selectedUser?.status === 'Hoạt động'}
                            icon={selectedUser?.status === 'Hoạt động' ? <LockOutlined /> : <UnlockOutlined />}
                        >
                            {selectedUser?.status === 'Hoạt động' ? 'Khóa Tài Khoản' : 'Mở Khóa Tài Khoản'}
                        </Button>
                    </Popconfirm>,
                ]}
            >
                {selectedUser && (
                    <div className="text-center mb-6">
                        <Avatar size={80} src={selectedUser.avatar} className="mb-2" />
                        <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                        {renderStatusTag(selectedUser.status)}
                    </div>
                )}

                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label={<span className="font-medium"><UserOutlined /> Tên người dùng</span>}>{selectedUser?.name}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><MailOutlined /> Email</span>}>{selectedUser?.email}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><PhoneOutlined /> Điện thoại</span>}>{selectedUser?.phone}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><SafetyOutlined /> Loại tài khoản</span>}>{renderTypeTag(selectedUser?.userType || 'Khách hàng')}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium"><CalendarOutlined /> Ngày đăng ký</span>}>{selectedUser?.registeredDate}</Descriptions.Item>
                    <Descriptions.Item label={<span className="font-medium">Địa chỉ</span>}>{selectedUser?.address}</Descriptions.Item>
                    
                </Descriptions>
            </Modal>

        </AdminLayout>
    );
}