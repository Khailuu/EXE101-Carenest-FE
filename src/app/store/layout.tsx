"use client";

import { Layout } from 'antd';
import Sidebar from './components/Sidebar'; 
import { JSX, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingProvider } from './components/LoadingContext'; 
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { shopService, Shop } from '@/services/shopService';
import StoreHeader from '@/app/store/info/components/StoreHeader';

const { Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const shopId = useSelector((state: RootState) => state.user.shopId);
    const [shopInfo, setShopInfo] = useState<Shop | null>(null);

    useEffect(() => {
        const fetchShopInfo = async () => {
            if (shopId) {
                try {
                    const info = await shopService.getShopById(shopId);
                    setShopInfo(info);
                } catch (error) {
                }
            }
        };
        fetchShopInfo();
    }, [shopId]); 

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            
            <Layout style={{ transition: 'margin-left 0.2s', backgroundColor: '#f5f7f9' }}>
                <StoreHeader shopInfo={shopInfo} />
                
                <Content 
                    style={{ 
                        margin: '24px 16px', 
                        padding: 24, 
                        minHeight: 280, 
                        background: '#fff',
                        borderRadius: 8,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default function StoreRootLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <LoadingProvider>
            <MainLayout>{children}</MainLayout>
        </LoadingProvider>
    );
}