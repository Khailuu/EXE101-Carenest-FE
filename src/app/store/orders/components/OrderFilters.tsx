import { Button, Select, Input, Row, Col } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function OrderFilters() {
    return (
        <Row gutter={[16, 16]} align="middle" className="mb-4">
            <Col xs={24} md={10} lg={6}>
                <Input 
                    placeholder="Tìm kiếm theo tên khách hàng, SĐT..." 
                    prefix={<SearchOutlined className="text-gray-400" />}
                    size="large"
                />
            </Col>
            <Col xs={12} md={6} lg={3}>
                <Select defaultValue="branch" style={{ width: '100%' }} size="large">
                    <Option value="branch">Chi nhánh</Option>
                    <Option value="all">Tất cả</Option>
                </Select>
            </Col>
            <Col xs={12} md={8} lg={3}>
                <Select defaultValue="day" style={{ width: '100%' }} size="large">
                    <Option value="day">Hôm nay</Option>
                    <Option value="week">Tuần này</Option>
                </Select>
            </Col>
            <Col xs={24} lg={12} className="flex justify-end">
                <Button icon={<FilterOutlined />} size="large" className="text-teal-600 border-teal-300">
                    Bộ Lọc Nâng Cao
                </Button>
            </Col>
        </Row>
    );
}