"use client";

import { Layout, Spin } from 'antd';
import AdminSidebar from './AdminSidebar';
import { JSX } from 'react';
import { LoadingProvider, useLoading } from './LoadingContext'; // Import Context

const { Content } = Layout;

// Component Layout chính 
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading } = useLoading();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AdminSidebar />
            
            <Layout style={{ marginLeft: 260 }}>
                {/* Content Area */}
                <Content 
                    style={{ 
                        margin: '24px 16px', 
                        padding: 24, 
                        minHeight: 280, 
                        background: '#f0f2f5', // Màu nền tổng thể 
                        position: 'relative', // Quan trọng cho việc định vị Spin
                    }}
                >
                    {/* Spin Overlay */}
                    {isLoading && (
                        <div 
                            className="absolute inset-0 z-50 flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                        >
                            <Spin size="large" tip="Đang tải..." />
                        </div>
                    )}

                    {/* Nội dung trang */}
                    <div style={{ opacity: isLoading ? 0.5 : 1 }}>
                        {children}
                    </div>

                </Content>
            </Layout>
        </Layout>
    );
}


// Component Export (bao bọc MainLayout bằng Provider)
export default function AdminLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <LoadingProvider>
            <MainLayout>{children}</MainLayout>
        </LoadingProvider>
    );
}