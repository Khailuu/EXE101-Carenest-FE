// src/app/store/staff/components/StaffFilters.tsx

import { Button, Input, Select, Card, Row, Col, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import { JSX } from 'react';

const { Option } = Select;

interface StaffFiltersProps {
    isAdvancedSearchOpen: boolean;
    setIsAdvancedSearchOpen: (isOpen: boolean) => void;
    setIsFormModalOpen: (isOpen: boolean) => void;
}

export default function StaffFilters({ isAdvancedSearchOpen, setIsAdvancedSearchOpen, setIsFormModalOpen }: StaffFiltersProps): JSX.Element {
    
    return (
        <Card bordered={false} className="shadow-lg rounded-xl mb-6 p-2">
            {/* Thanh tìm kiếm chính */}
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={10} lg={6}>
                    <Select
                        defaultValue="name"
                        className="w-full rounded-l-lg"
                        size="large"
                        dropdownStyle={{ zIndex: 9999 }}
                    >
                        <Option value="name">Tên nhân viên</Option>
                        <Option value="email">Email</Option>
                        <Option value="branch">Chi nhánh</Option>
                    </Select>
                </Col>
                <Col xs={24} md={14} lg={10}>
                    <Input
                        placeholder="Nhập từ khóa..."
                        size="large"
                        className="rounded-r-lg"
                    />
                </Col>
                <Col xs={24} md={12} lg={4}>
                    <Button
                        size="large"
                        icon={<SearchOutlined />}
                        className="w-full bg-teal-500 text-white border-teal-500 hover:!bg-teal-600 hover:!text-white"
                    >
                        Tìm kiếm
                    </Button>
                </Col>
                <Col xs={24} md={12} lg={4} className="flex justify-between md:justify-end">
                    <Button
                        size="large"
                        type="default"
                        onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                        className="!text-teal-600 hover:!text-teal-700 border-dashed border-teal-300 mr-2"
                        icon={<DownOutlined />}
                    >
                        Nâng cao
                    </Button>
                    <Button
                        size="large"
                        type="primary"
                        icon={<PlusOutlined />}
                        className="!ml-[15px] !bg-green-500 hover:!bg-green-600"
                        onClick={() => setIsFormModalOpen(true)} // Mở modal Thêm mới
                    >
                    </Button>
                </Col>
            </Row>

            {/* Tìm kiếm nâng cao Modal (Giả lập) */}
            <Modal
                title="Tìm kiếm Nâng cao"
                open={isAdvancedSearchOpen}
                onCancel={() => setIsAdvancedSearchOpen(false)}
                footer={null}
                centered
            >
                <p>Đây là nơi đặt các trường lọc nâng cao (ví dụ: Lọc theo Vai trò, Trạng thái, Ngày bắt đầu).</p>
            </Modal>
        </Card>
    );
}