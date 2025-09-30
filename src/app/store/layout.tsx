"use client";

import { Layout, Spin } from 'antd';
import Sidebar from './components/Sidebar'; 
import { JSX, useEffect } from 'react'; // Import useEffect
import { usePathname } from 'next/navigation'; // Import usePathname
import { LoadingProvider, useLoading } from './components/LoadingContext'; 

const { Content } = Layout;

// Component Layout chính (đã bọc logic Spin)
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading, setLoading } = useLoading(); // Lấy cả setLoading
    const pathname = usePathname(); // Lấy path hiện tại

    // *** LOGIC QUAN TRỌNG ĐỂ TẮT LOADING ***
    useEffect(() => {
        // Sau khi URL thay đổi (trang đã tải xong), tắt loading
        if (isLoading) {
             // Dùng setTimeout nhỏ để đảm bảo quá trình render nội dung đã xong
            const timer = setTimeout(() => {
                setLoading(false);
            }, 100); 

            return () => clearTimeout(timer);
        }
    }, [pathname]); // Theo dõi sự thay đổi của path

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            {/* Cần đặt marginLeft bằng width của Sidebar (280px) để content không bị che */}
            <Sidebar />
            
            {/* Layout chứa Content */}
            <Layout style={{ transition: 'margin-left 0.2s', backgroundColor: '#f5f7f9' }}>
                
                {/* Content Area */}
                <Content 
                    style={{ 
                        margin: '24px 16px', 
                        padding: 24, 
                        minHeight: 280, 
                        background: '#fff',
                        borderRadius: 8,
                        position: 'relative', 
                    }}
                >
                    {/* Spin Overlay */}
                    {isLoading && (
                        <div 
                            className="absolute inset-0 z-50 flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 8 }}
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

export default function StoreRootLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <LoadingProvider>
            <MainLayout>{children}</MainLayout>
        </LoadingProvider>
    );
}