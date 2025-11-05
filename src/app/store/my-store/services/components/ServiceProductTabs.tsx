import { Button } from 'antd';
import { StoreTabType } from '../hooks/useStoreData'; 
import { JSX } from 'react';

interface ServiceProductTabsProps {
    activeTab: StoreTabType;
    setActiveTab: (tab: StoreTabType) => void;
}

const tabConfig: { key: StoreTabType; label: string }[] = [
    { key: 'Category Sản Phẩm', label: 'Category Sản Phẩm' },
    { key: 'Sản Phẩm', label: 'Sản Phẩm' },
    { key: 'Chi Tiết Sản Phẩm', label: 'Chi Tiết Sản Phẩm' },
];

export default function ServiceProductTabs({ activeTab, setActiveTab }: ServiceProductTabsProps): JSX.Element {
    return (
        <div className="flex mb-6 flex-wrap gap-2"> 
            {tabConfig.map((tab) => (
                <Button
                    key={tab.key}
                    size="large"
                    type={activeTab === tab.key ? 'primary' : 'default'}
                    className={`rounded-lg ${
                        activeTab === tab.key
                            ? 'bg-teal-500! text-white! font-semibold border-teal-500! hover:text-white! hover:bg-teal-600!'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:text-gray-900! hover:border-gray-400!'
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                >
                    {tab.label}
                </Button>
            ))}
        </div>
    );
}