"use client";
import { Modal, Form, Input, Button, Select, InputNumber, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { JSX, useEffect } from "react";
import { CategoryData, ProductData } from "../../hooks/useStoreData";

interface ProductFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingItem?: ProductData | null;
  categoryData: CategoryData[];
}

export default function ProductFormModal({
  open,
  onCancel,
  onSubmit,
  editingItem,
  categoryData,
}: ProductFormModalProps): JSX.Element {
  const [form] = Form.useForm();
  const isEditing = !!editingItem;

  useEffect(() => {
    if (open) {
      if (isEditing && editingItem) {
        form.setFieldsValue({
          ...editingItem,
          image: editingItem.image ? [{ uid: '-1', name: 'image.png', status: 'done', url: editingItem.image }] : [],
          status: editingItem.status === "Hoạt động" ? "Hoạt động" : "Ngưng hoạt động",
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: "Hoạt động" });
      }
    }
  }, [open, editingItem, form, isEditing]);

  return (
    <Modal
      title={isEditing ? "Sửa Sản phẩm" : "Thêm Sản phẩm mới"}
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
          label="Tên Sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          name="productCategoryId"
          label="Danh mục sản phẩm"
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

        <Form.Item name="stock" label="Số lượng trong kho" rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}>
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Vui lòng nhập giá" }]}>
          <InputNumber min={0} className="w-full" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item name="discount" label="Giảm giá (%)" rules={[{ required: true, message: "Vui lòng nhập giảm giá" }]}>
          <InputNumber min={0} max={100} className="w-full" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="image" label="Hình ảnh">
          <Upload
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            fileList={form.getFieldValue('image') ? [form.getFieldValue('image')] : []}
            onChange={({ fileList }) => form.setFieldsValue({ image: fileList[0] || null })}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
