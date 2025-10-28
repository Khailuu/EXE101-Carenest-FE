"use client";
import { Modal, Form, Input, Button } from "antd";
import { JSX, useEffect } from "react";

interface CategoryFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingItem?: any | null;
}

export default function CategoryFormModal({
  open,
  onCancel,
  onSubmit,
  editingItem,
}: CategoryFormModalProps): JSX.Element {
  const [form] = Form.useForm();
  const isEditing = !!editingItem;

  useEffect(() => {
    if (open) {
      form.setFieldsValue(editingItem || {});
    }
  }, [open, editingItem, form]);

  return (
    <Modal
      title={isEditing ? "Sửa Category" : "Thêm Category mới"}
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
          label="Tên Category"
          rules={[{ required: true, message: "Vui lòng nhập tên Category" }]}
        >
          <Input placeholder="Nhập tên category" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
