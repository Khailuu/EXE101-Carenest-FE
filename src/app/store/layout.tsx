"use client";

import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
// import HeaderBar from "./components/Header"; // Không dùng HeaderBar ở đây

const { Content } = Layout;

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  // Chiều cao cố định cho Sidebar
  const sidebarHeight = '100vh'; 

  return (
    // THAY ĐỔI: Thêm hasSider để Ant Design biết có Sider cố định
    <Layout className="min-h-screen" hasSider> 
        
      {/* SỬA: Bọc Sidebar trong Layout, và đặt style 'fixed' cho nó */}
      <Layout 
          // Đây là Layout dành riêng cho Sider
          style={{ width: 280, height: sidebarHeight, position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 10 }}>
        <Sidebar />
      </Layout>
      
      {/* Layout chứa Content chính */}
      <Layout>
        
        {/* THAY ĐỔI: Thêm margin-left để đẩy Content ra khỏi khu vực Sidebar cố định */}
        <Content 
            className="p-6 bg-gray-50 flex-1" 
            style={{ marginLeft: 280, minHeight: sidebarHeight }}>
            {children}
        </Content>
      </Layout>
    </Layout>
  );
}