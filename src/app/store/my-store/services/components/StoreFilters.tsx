import {
  Button,
  Input,
  Select,
  Card,
  Row,
  Col,
  Modal,
  Form,
  InputNumber,
  Upload,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  StoreStatusType,
  ServiceData,
  ProductData,
  ItemType,
} from "../hooks/useStoreData";
import { JSX, useEffect } from "react";

const { Option } = Select;
const { TextArea } = Input;

interface StoreFiltersProps {
  isAdvancedSearchOpen: boolean;
  setIsAdvancedSearchOpen: (isOpen: boolean) => void;
  activeStatusFilter: StoreStatusType;
  setActiveStatusFilter: (status: StoreStatusType) => void;

  // Props cho Modal Form
  isFormModalOpen: boolean;
  setIsFormModalOpen: (isOpen: boolean) => void;
  editingItem: ServiceData | ProductData | null;
  activeTab: "Dịch Vụ" | "Sản Phẩm";
  handleSave: (values: any, type: ItemType) => void;
}

// --- Component Modal Form (Đã fix lỗi parser) ---
const ItemFormModal = ({
  isFormModalOpen,
  setIsFormModalOpen,
  editingItem,
  activeTab,
  handleSave,
}: Omit<
  StoreFiltersProps,
  | "isAdvancedSearchOpen"
  | "setIsAdvancedSearchOpen"
  | "activeStatusFilter"
  | "setActiveStatusFilter"
>): JSX.Element => {
  const [form] = Form.useForm();
  const isEditing = !!editingItem;
  const type = activeTab === "Dịch Vụ" ? "service" : "product";

  useEffect(() => {
    if (isFormModalOpen) {
      form.setFieldsValue(
        editingItem || { status: "Hoạt động", discount: 0, price: 0 }
      );
    }
  }, [isFormModalOpen, editingItem, form]);

  const onFinish = (values: any) => {
    handleSave(values, type);
  };

  const handleCancel = () => {
    setIsFormModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={
        isEditing
          ? `Sửa ${activeTab.toLowerCase()}: ${editingItem?.name}`
          : `Thêm ${activeTab.toLowerCase()} mới`
      }
      open={isFormModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={form.submit}
          className="bg-teal-500 hover:bg-teal-600"
        >
          {isEditing ? "Lưu Thay Đổi" : "Thêm Mới"}
        </Button>,
      ]}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: "Hoạt động", discount: 0 }}
      >
        <Form.Item
          name="name"
          label={`Tên ${activeTab.toLowerCase()}`}
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          {activeTab === "Dịch Vụ" && (
            <Col span={12}>
              <Form.Item name="duration" label="Thời gian thực hiện">
                <Input placeholder="Ví dụ: 60 phút" />
              </Form.Item>
            </Col>
          )}

          {activeTab === "Sản Phẩm" && (
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Số lượng trong kho"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item
              name="price"
              label="Giá"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber min={0} addonAfter="VNĐ" className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="discount" label="Giảm giá (%)">
              <InputNumber<number> // <--- CHỈ ĐỊNH RÕ KIỂU LÀ NUMBER Ở ĐÂY
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => {
                  const numericValue = value?.replace("%", "");
                  // Đảm bảo giá trị trả về là number
                  return Number.isNaN(Number(numericValue))
                    ? 0
                    : Number(numericValue);
                }}
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Hoạt động">Hoạt động</Option>
                <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
// --- Component chính StoreFilters ---
export default function StoreFilters(props: StoreFiltersProps): JSX.Element {
  const {
    isAdvancedSearchOpen,
    setIsAdvancedSearchOpen,
    activeStatusFilter,
    setActiveStatusFilter,
    isFormModalOpen,
    setIsFormModalOpen,
    editingItem,
    activeTab,
    handleSave,
  } = props;

  return (
    <Card bordered={false} className="shadow-lg rounded-xl mb-6">
      {/* Thanh tìm kiếm chính */}
      <Row gutter={[16, 16]} align="middle" className="mb-4">
        <Col xs={24} md={10} lg={6}>
          <Select
            defaultValue="name"
            className="w-full rounded-l-lg"
            size="large"
            dropdownStyle={{ zIndex: 9999 }}
          >
            <Option value="name">Tên sản phẩm/dịch vụ</Option>
            <Option value="id">Mã SKU</Option>
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
        <Col
          xs={24}
          md={12}
          lg={4}
          className="flex justify-between md:justify-end"
        >
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
            onClick={() => setIsFormModalOpen(true)}
          >
          </Button>
        </Col>
      </Row>

      {/* Lọc Trạng thái (Phía trên Table) */}
      <div className="flex justify-end mb-4">
        <Select
          defaultValue="all"
          className="w-40"
          size="large"
          value={activeStatusFilter}
          onChange={(value) => setActiveStatusFilter(value as StoreStatusType)}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="Hoạt động">Hoạt động</Option>
          <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
        </Select>
      </div>

      {/* Tìm kiếm nâng cao Modal (Giả lập) */}
      <Modal
        title="Tìm kiếm Nâng cao"
        open={isAdvancedSearchOpen}
        onCancel={() => setIsAdvancedSearchOpen(false)}
        footer={null}
        centered
      >
        <p>
          Đây là nơi đặt các trường lọc nâng cao (ví dụ: Lọc theo Giá, Danh mục,
          Lượng tồn kho).
        </p>
      </Modal>

      {/* Modal Thêm/Sửa Sản phẩm/Dịch vụ */}
      <ItemFormModal
        isFormModalOpen={isFormModalOpen}
        setIsFormModalOpen={setIsFormModalOpen}
        editingItem={editingItem}
        activeTab={activeTab}
        handleSave={handleSave}
      />
    </Card>
  );
}
