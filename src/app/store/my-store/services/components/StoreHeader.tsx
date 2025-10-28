import { Avatar } from 'antd';
import { JSX } from 'react';

export default function StoreHeader(): JSX.Element {
    return (
        <div className="bg-[#E0FAF7] py-6 border-b-4 border-teal-500 mb-6 rounded-lg shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <Avatar
                    size={64}
                    src="https://i.pravatar.cc/150?img=9"
                    className="shadow-md border-2 border-white bg-white"
                />
                <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Chào mừng quay trở lại
                    </h1>
                    <h2 className="text-3xl font-extrabold text-teal-700">
                        Cửa hàng chăm sóc sức khỏe thú cưng PetCare Mới
                    </h2>
                </div>
            </div>
        </div>
    );
}