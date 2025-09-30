"use client";

import { Layout } from "antd";
import Sidebar from "./components/Sidebar";

const { Content } = Layout;

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const sidebarHeight = '100vh'; 

  return (
    <Layout className="min-h-screen" hasSider> 
        
      <Layout 
          style={{ width: 280, height: sidebarHeight, position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 10 }}>
        <Sidebar />
      </Layout>
      
      <Layout>
        <Content 
            className="p-6 bg-gray-50 flex-1" 
            style={{ marginLeft: 280, minHeight: sidebarHeight }}>
            {children}
        </Content>
      </Layout>
    </Layout>
  );
}