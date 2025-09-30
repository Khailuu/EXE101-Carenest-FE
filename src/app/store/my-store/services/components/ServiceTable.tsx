// src/app/store/my-store/services/components/ServiceTable.tsx

import { Table, Button, Avatar, Tooltip, Popconfirm } from 'antd'; // Thêm Popconfirm
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ServiceData, formatCurrency, renderStatusTag } from '../hooks/useStoreData';
import { JSX } from 'react';

interface ServiceTableProps {
    data: ServiceData[];
    handleDelete: (key: string, type: 'service' | 'product') => void; // Prop mới
    handleOpenFormModal: (item: ServiceData | null) => void; // Prop mới
}

export default function ServiceTable({ data, handleDelete, handleOpenFormModal }: ServiceTableProps): JSX.Element {
    
    // Định nghĩa cột bên trong component để có thể sử dụng các hàm xử lý
    const serviceColumns: ColumnsType<ServiceData> = [
        {
          title: 'STT',
          dataIndex: 'key',
          key: 'key',
          width: 50,
        },
        {
          title: 'Tên dịch vụ',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Thời gian thực hiện',
          dataIndex: 'duration',
          key: 'duration',
          width: 120,
        },
        {
          title: 'Giá',
          dataIndex: 'price',
          key: 'price',
          render: (text: number) => <span className="font-semibold">{formatCurrency(text)}đ</span>,
          width: 100,
        },
        {
          title: 'Giảm giá',
          dataIndex: 'discount',
          key: 'discount',
          render: (text: number) => `${text}%`,
          width: 80,
        },
        {
          title: 'Hình ảnh',
          dataIndex: 'image',
          key: 'image',
          render: (url: string) => (
            <Avatar shape="square" size="large" src={url} className="shadow-sm border border-gray-100" />
          ),
          width: 80,
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true,
          render: (text: string) => (
            <Tooltip title={text}>
              <span className="text-gray-600 text-sm line-clamp-3">{text}</span>
            </Tooltip>
          )
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          key: 'status',
          render: renderStatusTag,
          width: 120,
        },
        {
          title: 'Hành động',
          key: 'action',
          render: (_, record) => (
            <div className="flex gap-2">
              <Button 
                type="text" 
                icon={<EditOutlined className="text-blue-500" />} 
                onClick={() => handleOpenFormModal(record)} // Mở Modal Sửa
              />
              <Popconfirm
                title={`Xác nhận xóa dịch vụ: ${record.name}`}
                onConfirm={() => handleDelete(record.key, 'service')}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
              </Popconfirm>
            </div>
          ),
          width: 100,
        },
    ];

    return (
        <Table
            columns={serviceColumns}
            dataSource={data}
            pagination={{ pageSize: 7, hideOnSinglePage: true }}
            bordered
            className="rounded-lg overflow-hidden"
            scroll={{ x: 1000 }}
        />
    );
}