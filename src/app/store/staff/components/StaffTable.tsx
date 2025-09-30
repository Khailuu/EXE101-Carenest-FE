// src/app/store/staff/components/StaffTable.tsx

import { Table, Button, Avatar, Tooltip, Popconfirm, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { StaffData, StaffStatus, StaffRole } from '../page';
import { JSX } from 'react';

interface StaffTableProps {
    data: StaffData[];
    handleDelete: (key: string, name: string) => void;
    handleOpenFormModal: (item: StaffData | null) => void;
}

// Hàm render Tag trạng thái
const renderStatusTag = (status: StaffStatus): JSX.Element => {
    switch (status) {
        case 'Hoạt động':
            return <Tag color="green">Hoạt động</Tag>;
        case 'Tạm khóa':
            return <Tag color="red">Tạm khóa</Tag>;
        default:
            return <Tag>{status}</Tag>;
    }
};

export default function StaffTable({ data, handleDelete, handleOpenFormModal }: StaffTableProps): JSX.Element {
    
    const staffColumns: ColumnsType<StaffData> = [
        { title: 'STT', dataIndex: 'key', key: 'key', width: 60, align: 'center' },
        { 
            title: 'Hình ảnh',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (url: string) => <Avatar size="large" src={url} />,
            width: 80,
            align: 'center'
        },
        { title: 'Tên nhân viên', dataIndex: 'name', key: 'name', width: 180, 
          render: (text: string) => <span className="font-medium text-gray-700">{text}</span> 
        },
        { title: 'Vai trò', dataIndex: 'role', key: 'role', width: 100,
          render: (role: StaffRole) => (
            <Tag color={role === 'Quản lý' ? 'gold' : 'blue'}>
                {role}
            </Tag>
          )
        },
        { title: 'Chi nhánh', dataIndex: 'branch', key: 'branch', width: 120 },
        { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', width: 120 },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: renderStatusTag, width: 100, align: 'center' },
        {
          title: 'Hành động',
          key: 'action',
          render: (_, record) => (
            <div className="flex gap-2">
              <Tooltip title="Xem chi tiết">
                <Button 
                    type="text" 
                    icon={<EyeOutlined className="text-blue-500" />} 
                    onClick={() => handleOpenFormModal(record)} 
                />
              </Tooltip>
              <Popconfirm
                title={`Xác nhận xóa nhân viên: ${record.name}`}
                onConfirm={() => handleDelete(record.key, record.name)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
              </Popconfirm>
            </div>
          ),
          width: 100,
          align: 'center'
        },
    ];

    return (
        <Table
            columns={staffColumns}
            dataSource={data}
            pagination={{ pageSize: 8, hideOnSinglePage: true }}
            bordered
            className="rounded-lg overflow-hidden shadow-lg"
            scroll={{ x: 800 }}
        />
    );
}