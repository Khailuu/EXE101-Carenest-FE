// HeaderComponent.tsx

'use client'

import { Button, Menu } from "antd";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import Link from "next/link";
import { HomeOutlined, ShopOutlined, TagsOutlined, BookOutlined, MailOutlined, WalletOutlined, UserOutlined, LoginOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from 'antd'; 

// --- 1. Dữ liệu Menu Navigation ---
const menuItems: MenuProps['items'] = [
  {
    label: <Link href="/">Trang chủ</Link>,
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: <Link href="/store">Cửa hàng</Link>,
    key: '/store',
    icon: <ShopOutlined />,
  },
  {
    label: <Link href="/services">Dịch vụ</Link>,
    key: '/services',
    icon: <TagsOutlined />,
  },
  {
    label: <Link href="/blogs">Blogs</Link>,
    key: '/blogs',
    icon: <BookOutlined />,
  },
  {
    label: <Link href="/contact">Liên hệ</Link>,
    key: '/contact',
    icon: <MailOutlined />,
  },
  {
    label: <Link href="/wallet">Ví của bạn</Link>,
    key: '/wallet',
    icon: <WalletOutlined />,
  },
];

export default function HeaderComponent() {
  const router = useRouter();
  
  // *** LOGIC QUAN TRỌNG ***
  // Thay đổi giá trị này để kiểm tra (true/false)
  const userIsLoggedIn = false; 
  const userName = "Admin"; // Giả định tên người dùng (chỉ dùng khi logged in)

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const selectedKey = useMemo(() => {
    const activeItem = (menuItems ?? []).find(item => currentPath.startsWith(item?.key as string));
    return activeItem ? activeItem.key : '/';
  }, [currentPath]);


  return (
    <header className="shadow-md">
      {/* 2. Top Bar (Logo và Auth Buttons) */}
      <div className="bg-[#172554] flex justify-between items-center px-8 py-3"> {/* Xanh Navy Đậm */}
        
        {/* Logo/Banner */}
        <div className="flex items-center">
          <Link href="/">
              <span className="text-3xl font-extrabold text-white tracking-wider">
                  Pet<span className="text-[#2a9d8f]">Care</span>
              </span>
          </Link>
        </div>
    
        {/* Auth Buttons - Logic Điều kiện */}
        <div className="flex items-center space-x-3 mr-4">
          {
            !userIsLoggedIn ? (
              // HIỂN THỊ: Đăng nhập & Đăng ký
              <>
                <Button
                  type="default"
                  icon={<LoginOutlined />}
                  style={{
                    backgroundColor: "#fff",
                    color: "#172554",
                    fontWeight: "bold",
                    borderColor: "#fff"
                  }}
                  onClick={() => router.push("/login")}
                >
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  style={{
                    backgroundColor: "#2a9d8f", // Xanh teal
                    border: "none",
                    fontWeight: "bold",
                    marginLeft: 20
                  }}
                  // Đường dẫn này có thể là trang đăng ký chung hoặc đăng ký Cửa hàng
                  onClick={() => router.push("/register/user-register")} 
                >
                  Đăng ký
                </Button>
              </>
            ) : ( 
              // HIỂN THỊ: Xin chào, User! (Đã đăng nhập)
              <Button
                  type="primary"
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#2a9d8f",
                    border: "none",
                    fontWeight: "bold"
                  }}
                  onClick={() => router.push("/profile")} // Chuyển đến trang Hồ sơ
              >
                  Xin chào, {userName}!
              </Button>
            )
          }
        </div>
      </div>

      {/* 3. Navigation Menu */}
      <nav className="bg-white">
        <div className="max-w-[1400px] mx-auto">
            <Menu
                mode="horizontal"
                selectedKeys={[selectedKey as string]}
                items={menuItems}
                className="font-medium text-[16px] border-b-0"
                style={{
                    color: '#172554', 
                }}
            />
        </div>
      </nav>
    </header>
  );
}