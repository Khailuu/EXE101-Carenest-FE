
"use client";
import { Layout, Menu, Button } from "antd";
import {
  BarChartOutlined,
  UserOutlined,
  ShopOutlined,
  TeamOutlined, 
  LogoutOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useLoading } from './LoadingContext'; // Import useLoading hook
import { JSX } from "react";

const { Sider } = Layout;

export default function AdminSidebar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { setLoading } = useLoading(); // Lấy hàm setLoading từ Context

  // Hàm xử lý khi click vào Menu Item
  const handleMenuItemClick = async (path: string) => {
    if (path !== pathname) {
      setLoading(true); // BẬT LOADING
      
      // Chuyển trang
      router.push(path); 

    }
  };

  const items = [
    {
      key: "/admin/dashboard",
      icon: <BarChartOutlined className="text-xl" />,
      label: "Bảng điều khiển",
    },
    {
      key: "/admin/user-management",
      icon: <UserOutlined className="text-xl" />,
      label: "Quản lý người dùng",
    },
    {
      key: "/admin/store-management",
      icon: <ShopOutlined className="text-xl" />,
      label: "Quản lý cửa hàng",
    },
    {
      key: "/admin/community-management",
      icon: <TeamOutlined className="text-xl" />,
      label: "Quản lý cộng đồng",
    },
  ];

  const handleLogout = () => {
    router.push("/login"); 
  };

  return (
    <Sider
      width={260}
      breakpoint="lg"
      collapsedWidth="0" 
      className="z-50 shadow-2xl" 
      style={{
        position: 'fixed',
        height: '100vh', 
        left: 0,
        top: 0,
        background: 'linear-gradient(180deg, #1e3a8a 0%, #172554 100%)',
        overflowY: 'auto', 
      }}
    >
      {/* Logo & Tên Admin */}
      <div className="p-6 text-center border-b border-blue-800">
        <h1 className="text-3xl font-extrabold text-white">
          <span style={{ color: "#93c5fd" }}>ADMIN</span> PetCare
        </h1>
        <p className="text-sm text-blue-300 mt-1">Hệ thống quản trị</p>
      </div>

      {/* Menu Navigation */}
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={items.map(item => ({
            ...item,
            // Sử dụng onClick thay vì Link trong label
            onClick: () => handleMenuItemClick(item.key),
            label: <div className="text-lg">{item.label}</div> // Bọc label vào div
        }))}
        className="bg-transparent border-0 px-2 mt-4"
        style={{
          backgroundColor: "transparent",
          color: "white",
          fontSize: "16px",
        }}
        theme="dark" 
      />

      {/* Logout Section */}
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <Button
            type="primary"
            icon={<LogoutOutlined className="text-xl" />}
            size="large"
            onClick={handleLogout} 
            className="w-full text-lg font-semibold border-0 bg-transparent text-white shadow-none 
                       hover:!bg-white hover:!bg-opacity-10 hover:!text-white"
        >
            Đăng xuất
        </Button>
      </div>
    </Sider>
  );
}