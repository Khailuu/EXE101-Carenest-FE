// src/app/store/info/components/StoreInfoWalletTab.tsx

import { Card, Button, Divider, QRCode } from 'antd';
import { DollarCircleOutlined, QrcodeOutlined } from '@ant-design/icons';
import { JSX } from 'react';

export default function StoreInfoWalletTab(): JSX.Element {
    const totalBalance = 500000; // Giả định số dư

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Cột 1: Thông tin số dư */}
            <Card className="shadow-md col-span-1 border-t-4 border-teal-500">
                <div className="flex items-center space-x-4 mb-4">
                    <DollarCircleOutlined className="text-4xl text-teal-600" />
                    <div>
                        <p className="text-lg text-gray-500">Số dư hiện tại</p>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {new Intl.NumberFormat('vi-VN').format(totalBalance)}₫
                        </h2>
                    </div>
                </div>
                <Divider />
                <div className="flex gap-4">
                    <Button type="primary" className='bg-teal-500 hover:bg-teal-600 w-full'>
                        Nạp tiền
                    </Button>
                    <Button type="default" className='w-full'>
                        Rút tiền
                    </Button>
                </div>
            </Card>

            {/* Cột 2: Lịch sử và thông tin chi tiết */}
            <Card className="shadow-md col-span-2">
                <h3 className="text-xl font-semibold mb-4">Lịch sử giao dịch gần đây</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600 border-b pb-2">
                        <span>Nạp tiền</span>
                        <span className="text-green-600 font-semibold">+ 200.000₫</span>
                        <span>10/09/2025</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 border-b pb-2">
                        <span>Thanh toán phí dịch vụ</span>
                        <span className="text-red-600 font-semibold">- 50.000₫</span>
                        <span>09/09/2025</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 border-b pb-2">
                        <span>Nhận hoa hồng</span>
                        <span className="text-green-600 font-semibold">+ 150.000₫</span>
                        <span>08/09/2025</span>
                    </div>
                </div>
                <Button type="link" className="mt-4 p-0">Xem tất cả giao dịch</Button>
            </Card>
            
            {/* Cột 3 (Dưới cùng, bao quát): Mã QR */}
            <Card className="shadow-md lg:col-span-3">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Mã QR Thanh toán</h3>
                        <p className="text-gray-600 mb-4 max-w-lg">
                            Khách hàng có thể quét mã QR này để thanh toán dịch vụ hoặc sản phẩm trực tiếp vào ví của cửa hàng.
                        </p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                        <QRCode
                            errorLevel="H"
                            value="Pettiny-Store-Wallet-ID-A1B2C3D4"
                            size={120}
                            icon="https://cdn.jsdelivr.net/npm/@ant-design/icons-svg@4.2.1/svg/outlined/qrcode.svg"
                        />
                        <p className="mt-2 text-sm font-medium">Mã ví: A1B2C3D4</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}