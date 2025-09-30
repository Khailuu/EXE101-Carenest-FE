"use client";

import { Table, Button } from "antd";

export default function CustomersPage() {
  const columns = [
    { title: "Tên khách hàng", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Thao tác",
      key: "action",
      render: () => <Button type="default">Xem chi tiết</Button>,
    },
  ];

  const data = [
    { key: 1, name: "Nguyễn Văn A", email: "a@gmail.com", phone: "0123456789" },
    { key: 2, name: "Trần Thị B", email: "b@gmail.com", phone: "0987654321" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">👤 Quản lý khách hàng</h1>
      <Table columns={columns} dataSource={data} bordered />
    </div>
  );
}
