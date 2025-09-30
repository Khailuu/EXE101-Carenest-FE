// src/app/admin/dashboard/page.tsx

"use client";

import { useState, useMemo, JSX } from 'react';
import { Card, Row, Col, DatePicker, Select, Statistic, Spin } from 'antd';
import { UserOutlined, ShopOutlined, DollarCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import AdminLayout from '../components/AdminLayout';
import moment from 'moment'; 
import dynamic from 'next/dynamic'; 

const { RangePicker } = DatePicker;
const { Option } = Select;

// 1. Dynamic Import: Đảm bảo biểu đồ chỉ chạy client-side
const DualAxesChart = dynamic(
    () => import('../components/DualAxesChart'),
    { 
        ssr: false, 
        loading: () => <div style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>
    } 
);

// Định nghĩa kiểu dữ liệu
type RawDataItem = { date: string, user_count: number, revenue: number };
type AggregatedDataItem = { time_period: string, user_count: number, revenue: number };

// --- MOCK DATA GỐC ---
const rawData: RawDataItem[] = [
    { date: '2025-01-01', user_count: 5, revenue: 100 },
    { date: '2025-01-05', user_count: 8, revenue: 150 },
    { date: '2025-02-01', user_count: 15, revenue: 300 },
    { date: '2025-02-10', user_count: 20, revenue: 400 },
    { date: '2025-03-01', user_count: 25, revenue: 500 },
    { date: '2025-03-20', user_count: 30, revenue: 600 },
    { date: '2025-09-01', user_count: 150, revenue: 3000 },
    { date: '2025-09-20', user_count: 180, revenue: 3500 },
    { date: '2026-01-01', user_count: 200, revenue: 4000 },
];

// Hàm xử lý tổng hợp dữ liệu
const aggregateData = (data: RawDataItem[], timeframe: string): AggregatedDataItem[] => {
    const aggregated = new Map<string, { user_count: number, revenue: number }>();
    let format: string;
    
    if (timeframe === 'daily') format = 'YYYY-MM-DD';
    else if (timeframe === 'monthly') format = 'YYYY-MM';
    else format = 'YYYY';

    data.forEach(item => {
        const key = moment(item.date).isValid() ? moment(item.date).format(format) : 'Invalid Date';
        if (key === 'Invalid Date') return;
        
        if (aggregated.has(key)) {
            const existing = aggregated.get(key)!;
            existing.user_count += item.user_count;
            existing.revenue += item.revenue;
        } else {
            aggregated.set(key, { user_count: item.user_count, revenue: item.revenue }); 
        }
    });

    return Array.from(aggregated, ([key, value]) => ({ 
        time_period: key, 
        user_count: value.user_count, 
        revenue: value.revenue 
    }));
};

export default function DashboardPage(): JSX.Element {
    const [timeframe, setTimeframe] = useState('monthly'); 
    
    // Tính toán dữ liệu biểu đồ
    const chartData = useMemo(() => {
        return aggregateData(rawData, timeframe);
    }, [timeframe]);

    const getTimeframeTitle = (tf: string) => {
        if (tf === 'daily') return '(Theo Ngày)';
        if (tf === 'monthly') return '(Theo Tháng)';
        if (tf === 'yearly') return '(Theo Năm)';
        return '';
    };

    // Mock data cho các ô thống kê nhanh
    const quickStats = {
        totalUsers: { value: 12345, growth: 15 },
        totalStores: { value: 350, growth: 5 },
        totalRevenue: { value: 56789, type: 'USD', growth: 'N/A' },
        totalAppointments: { value: 8900, growth: 12 },
    };


    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Bảng điều khiển</h1>

            {/* Date Range và Lựa chọn Timeframe */}
            <Row gutter={[16, 16]} className="mb-6 items-center">
                <Col>
                    <Select 
                        defaultValue="monthly" 
                        size="large" 
                        style={{ width: 150, fontWeight: 'bold' }}
                        onChange={(value) => setTimeframe(value)}
                        placeholder="Chọn khoảng thời gian"
                    >
                        <Option value="daily">Theo Ngày</Option>
                        <Option value="monthly">Theo Tháng</Option>
                        <Option value="yearly">Theo Năm</Option>
                    </Select>
                </Col>
                <Col>
                     <RangePicker 
                        size="large" 
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    />
                </Col>
            </Row>

            {/* Các ô thống kê nhanh */}
            <Row gutter={[24, 24]} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md">
                        <Statistic
                            title="Tổng Người Dùng"
                            value={quickStats.totalUsers.value}
                            prefix={<UserOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Tăng {quickStats.totalUsers.growth}% so với tháng trước
                        </p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md">
                        <Statistic
                            title="Tổng Cửa Hàng"
                            value={quickStats.totalStores.value}
                            prefix={<ShopOutlined className="text-green-500" />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                         <p className="text-sm text-gray-500 mt-2">
                            Tăng {quickStats.totalStores.growth}% so với tháng trước
                        </p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md">
                        <Statistic
                            title="Tổng Doanh Thu (K USD)"
                            value={quickStats.totalRevenue.value}
                            precision={0} 
                            prefix={<DollarCircleOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#cf1322' }} 
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Doanh thu phí dịch vụ
                        </p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md">
                        <Statistic
                            title="Tổng Cuộc Hẹn"
                            value={quickStats.totalAppointments.value}
                            prefix={<CalendarOutlined className="text-purple-500" />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                         <p className="text-sm text-gray-500 mt-2">
                            Tăng {quickStats.totalAppointments.growth}% so với tháng trước
                        </p>
                    </Card>
                </Col>
            </Row>

            {/* Khu vực Biểu đồ */}
            <Card className="shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Tăng trưởng Người dùng và Doanh thu {getTimeframeTitle(timeframe)}
                </h2>
                {/* Sử dụng component DualAxesChart được import động */}
                <DualAxesChart 
                    chartData={chartData} 
                    titleSuffix={getTimeframeTitle(timeframe)}
                />
            </Card>
        </AdminLayout>
    );
}