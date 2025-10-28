"use client";
import { Modal, Form, Input, Button, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { JSX, useEffect } from "react";
import { CategoryData } from "../../hooks/useStoreData";

interface ServiceFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingItem?: any | null;
  categoryData: CategoryData[];
}

export default function ServiceFormModal({
  open,
  onCancel,
  onSubmit,
  editingItem,
  categoryData,
}: ServiceFormModalProps): JSX.Element {
  const [form] = Form.useForm();
  const isEditing = !!editingItem;

  useEffect(() => {
    if (open) {
      form.setFieldsValue(editingItem || {});
    }
  }, [open, editingItem, form]);

  return (
    <Modal
      title={isEditing ? "Sửa Dịch vụ" : "Thêm Dịch vụ mới"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {isEditing ? "Lưu thay đổi" : "Thêm mới"}
        </Button>,
      ]}
      centered
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Tên Dịch vụ"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>

        <Form.Item
          name="serviceCategoryId"
          label="Danh mục dịch vụ"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select placeholder="Chọn danh mục">
            {categoryData.map((cat) => (
              <Select.Option key={cat.key} value={cat.key}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="image" label="Hình ảnh">
          <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
