"use client";

import { useState, useMemo, JSX } from 'react';
import { Card, Row, Col, DatePicker, Select, Statistic, Spin } from 'antd';
import { CalendarOutlined, DollarCircleOutlined, ShopOutlined, GiftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import dynamic from 'next/dynamic';
import moment from 'moment';
import { appointmentService } from '@/services/appointmentService';

const { RangePicker } = DatePicker;
const { Option } = Select;

// Dynamic Import for chart
const DualAxesChart = dynamic(
    () => import('../../admin/components/DualAxesChart'),
    {
        ssr: false,
        loading: () => <div style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>
    }
);

// Mock data for chart (can be replaced with real data later)
const rawData = [
    { date: '2025-01-01', appointments: 5, revenue: 100 },
    { date: '2025-01-05', appointments: 8, revenue: 150 },
    { date: '2025-02-01', appointments: 15, revenue: 300 },
    { date: '2025-02-10', appointments: 20, revenue: 400 },
    { date: '2025-03-01', appointments: 25, revenue: 500 },
    { date: '2025-03-20', appointments: 30, revenue: 600 },
];

const aggregateData = (data: any[], timeframe: string) => {
    const aggregated = new Map<string, { appointments: number, revenue: number }>();
    let format: string;

    if (timeframe === 'daily') format = 'YYYY-MM-DD';
    else if (timeframe === 'monthly') format = 'YYYY-MM';
    else format = 'YYYY';

    data.forEach(item => {
        const key = moment(item.date).isValid() ? moment(item.date).format(format) : 'Invalid Date';
        if (key === 'Invalid Date') return;

        if (aggregated.has(key)) {
            const existing = aggregated.get(key)!;
            existing.appointments += item.appointments;
            existing.revenue += item.revenue;
        } else {
            aggregated.set(key, { appointments: item.appointments, revenue: item.revenue });
        }
    });

    return Array.from(aggregated, ([key, value]) => ({
        time_period: key,
        appointments: value.appointments,
        revenue: value.revenue
    }));
};

export default function StoreDashboardPage(): JSX.Element {
    const [timeframe, setTimeframe] = useState('monthly');
    const shopId = useSelector((state: RootState) => state.user.shopId);

    // Fetch appointment dashboard stats
    const { data: dashboardStats, isLoading: statsLoading } = useQuery({
        queryKey: ['appointmentDashboard', shopId],
        queryFn: () => appointmentService.getDashboardStats(shopId || undefined),
        enabled: !!shopId,
    });

    const chartData = useMemo(() => {
        return aggregateData(rawData, timeframe);
    }, [timeframe]);

    // Calculate stats from API response
    const stats = useMemo(() => {
        if (!dashboardStats) {
            return {
                totalAppointments: 0,
                totalServices: 0,
                totalRevenue: 0,
            };
        }

        return {
            // Tổng số lịch hẹn = tổng count từ tất cả service details
            totalAppointments: dashboardStats.serviceDetailStats?.reduce((sum, stat) => sum + stat.count, 0) || 0,
            // Tổng số dịch vụ = số dịch vụ duy nhất
            totalServices: dashboardStats.serviceStats?.length || 0,
            // Tổng doanh thu = tổng count từ services (đơn vị: VND)
            totalRevenue: dashboardStats.serviceStats?.reduce((sum, stat) => sum + stat.count, 0) || 0,
        };
    }, [dashboardStats]);

    const getTimeframeTitle = (tf: string) => {
        if (tf === 'daily') return '(Theo Ngày)';
        if (tf === 'monthly') return '(Theo Tháng)';
        if (tf === 'yearly') return '(Theo Năm)';
        return '';
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Bảng điều khiển Cửa hàng</h1>

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
                            title="Tổng Lịch Hẹn"
                            value={stats.totalAppointments}
                            prefix={<CalendarOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#3f8600' }}
                            loading={statsLoading}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Tổng số lịch hẹn đã đặt
                        </p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md">
                        <Statistic
                            title="Tổng Dịch Vụ"
                            value={stats.totalServices}
                            prefix={<ShopOutlined className="text-green-500" />}
                            valueStyle={{ color: '#3f8600' }}
                            loading={statsLoading}
                        />
                         <p className="text-sm text-gray-500 mt-2">
                            Tổng số dịch vụ cung cấp
                        </p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md">
                        <Statistic
                            title="Tổng Sản Phẩm"
                            value={0}
                            prefix={<GiftOutlined className="text-purple-500" />}
                            valueStyle={{ color: '#722ed1' }}
                            loading={false}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Tổng số sản phẩm
                        </p>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="shadow-md">
                        <Statistic
                            title="Tổng Doanh Thu (K VND)"
                            value={stats.totalRevenue}
                            precision={0}
                            prefix={<DollarCircleOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#cf1322' }}
                            loading={statsLoading}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Doanh thu từ dịch vụ
                        </p>
                    </Card>
                </Col>
            </Row>

            {/* Khu vực Biểu đồ */}
            <Card className="shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Tăng trưởng Lịch hẹn và Doanh thu {getTimeframeTitle(timeframe)}
                </h2>
                <DualAxesChart
                    chartData={chartData}
                    titleSuffix={getTimeframeTitle(timeframe)}
                />
            </Card>
        </div>
    );
}
