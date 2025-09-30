// src/app/store/components/Sidebar.tsx

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
// Loại bỏ Link khỏi import vì chúng ta sẽ dùng onClick
import { usePathname, useRouter } from "next/navigation"; 
import { useLoading } from './LoadingContext'; // <--- IMPORT useLoading

const { Sider } = Layout;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setLoading } = useLoading(); // <--- Lấy hàm setLoading từ Context

  // Hàm xử lý khi click vào Menu Item
  const handleMenuItemClick = (path: string) => {
    if (path !== pathname) {
      setLoading(true); // BẬT LOADING
      router.push(path); 
      // Next.js sẽ tự động tắt loading khi trang đích hoàn tất tải
    }
  };

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    setLoading(true); // BẬT LOADING khi đăng xuất (chuyển về /login)
    router.push("/login");
  };

  // Cấu trúc items được thay đổi:
  // - Loại bỏ thẻ <Link>
  // - Thay thế bằng string hoặc JSX đơn giản, và thêm onClick
  const items = [
    {
      key: "/store",
      icon: <BarChartOutlined className="text-xl" />,
      label: (
        // Dùng div để style chữ lớn, giữ nguyên UI
        <div className="text-lg"> 
          Dashboard
        </div>
      ),
    },
    {
      key: "/store/orders",
      icon: <CalendarOutlined className="text-xl" />,
      label: (
        <div className="text-lg">
          Lịch hẹn
        </div>
      ),
    },
    {
      key: "/store/my-store/services",
      icon: <ShopOutlined className="text-xl" />,
      label: (
        <div className="text-lg">
          Cửa hàng của tôi
        </div>
      ),
    },
    {
      key: "/store/info",
      icon: <InfoCircleOutlined className="text-xl" />,
      label: (
        <div className="text-lg">
          Thông tin cửa hàng
        </div>
      ),
    },
    {
      key: "/store/staff",
      icon: <TeamOutlined className="text-xl" />,
      label: (
        <div className="text-lg">
          Quản lý nhân viên
        </div>
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
      {/* Logo Section (GIỮ NGUYÊN UI) */}
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

      {/* Menu - THAY ĐỔI CÁCH XỬ LÝ CLICK */}
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={items.map(item => ({
            ...item,
            // Thêm onClick để gọi hàm điều hướng kèm loading
            onClick: () => handleMenuItemClick(item.key),
        }))}
        className="bg-transparent border-0 px-4"
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
            className="w-full text-lg font-semibold border-0 bg-transparent text-white shadow-none 
                       hover:!bg-white hover:!bg-opacity-10 hover:!text-white"
            onClick={handleLogout} // Đã thêm setLoading(true) trong hàm này
        >
            Đăng xuất
        </Button>
      </div>
    </Sider>
  );
}