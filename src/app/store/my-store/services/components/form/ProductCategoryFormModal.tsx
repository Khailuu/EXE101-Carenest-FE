import { Modal, Form, Input, Button } from "antd";
import { JSX, useEffect } from "react";
import { ProductCategoryData } from "../../hooks/useStoreData";

interface ProductCategoryFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingItem?: ProductCategoryData | null;
}

export default function ProductCategoryFormModal({
  open,
  onCancel,
  onSubmit,
  editingItem,
}: ProductCategoryFormModalProps): JSX.Element {
  const [form] = Form.useForm();
  const isEditing = !!editingItem;

  useEffect(() => {
    if (open) {
      form.setFieldsValue(editingItem || {});
    }
  }, [open, editingItem, form]);

  return (
    <Modal
      title={isEditing ? "Sửa danh mục" : "Thêm danh mục mới"}
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
          label="Tên danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
