import { Modal, Form, Input, Button } from "antd";
import { JSX, useEffect } from "react";
import { ProductCategoryData } from "../../hooks/useStoreData";

interface ProductCategoryFormModalProps {
  open: boolean;
  onCancelAction: () => void;
  onSubmitAction: (values: any) => void;
  editingItem?: ProductCategoryData | null;
}

export default function ProductCategoryFormModal({
  open,
  onCancelAction,
  onSubmitAction,
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
      title={isEditing ? "Sửa Danh mục Sản phẩm" : "Thêm Danh mục Sản phẩm mới"}
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
          name="name"
          label="Tên Danh mục Sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục sản phẩm" }]}
        >
          <Input placeholder="Nhập tên danh mục sản phẩm" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
