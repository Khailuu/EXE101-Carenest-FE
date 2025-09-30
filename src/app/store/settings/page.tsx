"use client";

import { Form, Input, Button } from "antd";

export default function SettingsPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">⚙️ Cài đặt cửa hàng</h1>
      <Form layout="vertical">
        <Form.Item label="Tên cửa hàng" name="storeName">
          <Input placeholder="Nhập tên cửa hàng" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Lưu thay đổi</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
