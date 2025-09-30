"use client";
import { Layout, Menu, Button } from "antd";
import {
  BarChartOutlined,
  CalendarOutlined,
  ShopOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 

const { Sider } = Layout;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); //

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    router.push("/login"); // <-- CHUYỂN HƯỚNG
  };

  const items = [
    {
      key: "/store",
      icon: <BarChartOutlined className="text-xl" />,
      label: (
        <Link href="/store" className="text-lg"> 
          Dashboard
        </Link>
      ),
    },
    {
      key: "/store/orders",
      icon: <CalendarOutlined className="text-xl" />,
      label: (
        <Link
          href="/store/orders"
          className="text-lg"
        >
          Lịch hẹn
        </Link>
      ),
    },
    {
      key: "/store/my-store/services",
      icon: <ShopOutlined className="text-xl" />,
      label: (
        <Link
          href="/store/my-store/services"
          className="text-lg"
        >
          Cửa hàng của tôi
        </Link>
      ),
    },
    {
      key: "/store/info",
      icon: <InfoCircleOutlined className="text-xl" />,
      label: (
        <Link
          href="/store/info"
          className="text-lg"
        >
          Thông tin cửa hàng
        </Link>
      ),
    },
    {
      key: "/store/staff",
      icon: <TeamOutlined className="text-xl" />,
      label: (
        <Link
          href="/store/staff"
          className="text-lg"
        >
          Quản lý nhân viên
        </Link>
      ),
    },
  ];

  return (
    <Sider
      width={280}
      breakpoint="lg"
      collapsedWidth="0" 
      className="z-10 shadow-xl"
      style={{
        background: "linear-gradient(180deg, #4dd0e1 0%, #26a69a 100%)",
      }}
    >
      {/* Logo Section */}
      <div className="p-6 text-left">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
             <span className="text-teal-500 font-bold text-2xl">P</span>
          </div>

          <div>
            <span className="text-white font-bold text-2xl">
              <span style={{ color: "#ff7043" }}>Care</span>
              <span>Nest</span>
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={items}
        className="bg-transparent border-0 px-4"
        style={{
          backgroundColor: "transparent",
          color: "white",
          fontSize: "16px",
        }}
        itemHoverColor="#fff"
        itemActiveBg="#fff" 
        itemSelectedColor="#0d9488" 
        itemSelectedBg="#fff" 
        theme="dark" 
      />

      {/* Logout Section */}
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <Button
            type="primary"
            icon={<LogoutOutlined className="text-xl" />}
            size="large"
            className="w-full text-lg font-semibold border-0 bg-transparent text-white shadow-none 
                       hover:!bg-white hover:!bg-opacity-10 hover:!text-white"
            onClick={handleLogout} 
        >
            Đăng xuất
        </Button>
      </div>
    </Sider>
  );
}