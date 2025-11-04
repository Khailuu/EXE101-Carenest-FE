"use client";
import { Modal, Form, Input, Button } from "antd";
import { useEffect } from "react";
import { JSX } from "react";
import { CategoryData } from "../hooks/useStoreData";

interface CategoryFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingItem?: CategoryData | null;
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
      form.setFieldsValue(editingItem || { name: "", description: "" });
    }
  }, [open, editingItem, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Sửa danh mục" : "Thêm danh mục mới"}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {isEditing ? "Lưu thay đổi" : "Thêm mới"}
        </Button>,
      ]}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ name: "", description: "" }}
      >
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[
            { required: true, message: "Vui lòng nhập tên danh mục!" },
            { max: 100, message: "Tên danh mục không quá 100 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tên danh mục..." />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea
            placeholder="Nhập mô tả (tuỳ chọn)"
            rows={3}
            maxLength={255}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
