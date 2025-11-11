"use client";
import { Modal, Form, Input, Button, Select, Upload, Switch, Tooltip } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { JSX, useEffect } from "react";
import { ProductData, ProductCategoryData } from "../../hooks/useStoreData";

interface ProductFormModalProps {
  open: boolean;
  onCancelAction: () => void;
  onSubmitAction: (values: any) => void;
  editingItem?: ProductData | null;
  categoryData: ProductCategoryData[];
}

export default function ProductFormModal({
  open,
  onCancelAction,
  onSubmitAction,
  editingItem,
  categoryData,
}: ProductFormModalProps): JSX.Element {
  const [form] = Form.useForm();
  const isEditing = !!editingItem;

  useEffect(() => {
    if (open) {
      if (isEditing && editingItem) {
        // Map ProductData -> form fields
        form.setFieldsValue({
          productName: editingItem.name,
          productCategoryId: editingItem.productCategoryId,
          description: editingItem.description,
          status: editingItem.status === "Hoạt động",
          image: editingItem.image
            ? [{ uid: "-1", name: "current-image", status: "done", url: editingItem.image }]
            : [],
          imgUrls: editingItem.imgUrls || "",
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: true, image: [], imgUrls: "" });
      }
    }
  }, [open, editingItem, form, isEditing]);

  return (
    <Modal
      title={isEditing ? "Sửa Sản phẩm" : "Thêm Sản phẩm mới"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancelAction();
      }}
      footer={[
        <Button key="cancel" onClick={onCancelAction}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {isEditing ? "Lưu thay đổi" : "Thêm mới"}
        </Button>,
      ]}
      centered
    >
      <Form form={form} layout="vertical" onFinish={onSubmitAction}>
        <Form.Item
          name="productName"
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

        {/* Product create API doesn't accept stock/price/discount here; moved to Product Detail */}

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" valuePropName="checked" initialValue={true}>
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
        </Form.Item>

        <Form.Item name="imgUrls" label="Image URLs (JSON hoặc 1 URL)">
          <Input.TextArea
            rows={3}
            placeholder='Ví dụ: "https://domain/a.jpg"'
          />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="image"
            label="Hình ảnh tải lên (chỉ khi tạo mới)"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
