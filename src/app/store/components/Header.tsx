"use client";

import { Layout, Button } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function HeaderBar() {
  return (
    <Header className="bg-white shadow flex justify-between items-center px-6">
      <h2 className="text-lg font-semibold">Pet Store Admin</h2>
      <div className="flex gap-3">
        <Button icon={<SearchOutlined />} type="default">
          Tìm kiếm
        </Button>
        <Button icon={<UserOutlined />} type="primary">
          Tài khoản
        </Button>
      </div>
    </Header>
  );
}
