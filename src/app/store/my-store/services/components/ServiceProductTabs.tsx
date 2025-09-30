// src/app/store/my-store/services/components/ServiceProductTabs.tsx

import { Button } from 'antd';
import { StoreTabType } from '../hooks/useStoreData'; 
import { JSX } from 'react';

interface ServiceProductTabsProps {
    activeTab: StoreTabType;
    setActiveTab: (tab: StoreTabType) => void;
}

export default function ServiceProductTabs({ activeTab, setActiveTab }: ServiceProductTabsProps): JSX.Element {
    return (
        <div className="flex mb-6">
            <Button
                size="large"
                type={activeTab === 'Dịch Vụ' ? 'primary' : 'default'}
                className={`!mr-2 rounded-lg ${
                    activeTab === 'Dịch Vụ'
                        ? '!bg-teal-500 !text-white font-semibold !border-teal-500 hover:!text-white hover:!bg-teal-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:!text-gray-900'
                }`}
                onClick={() => setActiveTab('Dịch Vụ')}
            >
                Dịch Vụ
            </Button>
            <Button
                size="large"
                type={activeTab === 'Sản Phẩm' ? 'primary' : 'default'}
                className={`rounded-lg ${
                    activeTab === 'Sản Phẩm'
                        ? '!bg-teal-500 !text-white font-semibold !border-teal-500 hover:!text-white hover:!bg-teal-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:!text-gray-900'
                }`}
                onClick={() => setActiveTab('Sản Phẩm')}
            >
                Sản Phẩm
            </Button>
        </div>
    );
}