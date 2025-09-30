import { useState, JSX } from 'react';
import { Button, Table, Modal, Form, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface BranchData {
    key: string;
    name: string;
    address: string;
    phone: string;
}

const initialBranches: BranchData[] = [
    { key: '1', name: 'Hà Nội - Chi nhánh 1', address: 'Quận 1, TPHCM', phone: '0123456789' },
    { key: '2', name: 'Đà Nẵng - Chi nhánh 1', address: 'Quận 5, TPHCM', phone: '0987654321' },
];

export default function StoreInfoBranchTab(): JSX.Element {
    const [branches, setBranches] = useState<BranchData[]>(initialBranches);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
    const [form] = Form.useForm();

    const handleOpenModal = (branch: BranchData | null = null) => {
        setEditingBranch(branch);
        form.resetFields();
        if (branch) {
            form.setFieldsValue(branch);
        }
        setIsModalOpen(true);
    };

    const handleSave = (values: any) => {
        if (editingBranch) {
            // Sửa
            setBranches(prev => prev.map(b => b.key === editingBranch.key ? { ...values, key: editingBranch.key } : b));
            message.success(`Đã cập nhật chi nhánh: ${values.name}`);
        } else {
            // Thêm mới
            const newKey = String(branches.length > 0 ? Math.max(...branches.map(b => Number(b.key))) + 1 : 1);
            setBranches(prev => [{ ...values, key: newKey }, ...prev]);
            message.success(`Đã thêm chi nhánh mới: ${values.name}`);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (key: string, name: string) => {
        setBranches(prev => prev.filter(b => b.key !== key));
        message.success(`Đã xóa chi nhánh: ${name}`);
    };

    const branchColumns: ColumnsType<BranchData> = [
        { title: 'STT', dataIndex: 'key', key: 'key', width: 60 },
        { title: 'Tên chi nhánh', dataIndex: 'name', key: 'name' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button 
                        type="text" 
                        icon={<EditOutlined className="text-blue-500" />} 
                        onClick={() => handleOpenModal(record)}
                    />
                    <Popconfirm
                        title={`Xác nhận xóa chi nhánh: ${record.name}`}
                        onConfirm={() => handleDelete(record.key, record.name)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => handleOpenModal(null)}
                    className='!bg-green-500 hover:!bg-green-600'
                >
                    Tạo mới chi nhánh
                </Button>
            </div>
            
            <Table
                columns={branchColumns}
                dataSource={branches}
                pagination={false}
                bordered
            />

            <Modal
                title={editingBranch ? `Cập nhật chi nhánh: ${editingBranch.name}` : "Tạo mới chi nhánh"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalOpen(false)}>Hủy</Button>,
                    <Button key="submit" type="primary" onClick={form.submit} icon={<SaveOutlined />} className='bg-teal-500 hover:bg-teal-600'>
                        {editingBranch ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                ]}
                centered
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item name="name" label="Tên chi nhánh" rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}