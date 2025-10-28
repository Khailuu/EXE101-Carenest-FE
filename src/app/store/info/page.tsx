"use client";

import { useState, JSX } from 'react';
import { Card, Tabs, TabsProps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { shopService, Shop } from '@/services/shopService';

import StoreHeader from './components/StoreHeader';
import StoreInfoTab from './components/StoreInfoTab';
import StoreInfoBranchTab from './components/StoreInfoBranchTab';
import StoreInfoPasswordTab from './components/StoreInfoPasswordTab';
import StoreInfoWalletTab from './components/StoreInfoWalletTab';

export default function StoreInfoPage(): JSX.Element {
    const [activeKey, setActiveKey] = useState('info');

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: 'Thông tin',
            children: <StoreInfoTab />,
        },
        {
            key: 'branch',
            label: 'Chi nhánh',
            children: <StoreInfoBranchTab />,
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: <StoreInfoPasswordTab />,
        },
        {
            key: 'wallet',
            label: 'Ví của bạn',
            children: <StoreInfoWalletTab />,
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                <Card bordered={false} className="shadow-lg rounded-xl">
                    <Tabs 
                        defaultActiveKey="info" 
                        items={items} 
                        onChange={setActiveKey}
                    />
                </Card>
            </div>
        </div>
    );
}