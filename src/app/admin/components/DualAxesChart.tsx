// src/app/admin/components/DualAxesChart.tsx

"use client"; // BẮT BUỘC

import { DualAxes } from '@ant-design/charts';
import { Empty } from 'antd';
import { JSX } from 'react';

// Định nghĩa kiểu dữ liệu
type AggregatedDataItem = { time_period: string, user_count: number, revenue: number };

interface DualAxesChartProps {
    chartData: AggregatedDataItem[];
    titleSuffix: string;
}

export default function DualAxesChart({ chartData, titleSuffix }: DualAxesChartProps): JSX.Element {
    
    // Cấu hình đơn giản hóa để đảm bảo render được
    const dualAxesConfig = {
        data: [chartData, chartData], 
        xField: 'time_period', 
        yField: ['user_count', 'revenue'], 
        geometry: ['line', 'line'], 
        height: 400,

        // Cấu hình trục Y tối giản
        yAxis: {
            user_count: { title: { text: 'Người Dùng (Trái)', style: { fill: '#1890ff' } } },
            revenue: { title: { text: 'Doanh Thu (Phải)', style: { fill: '#f5222d' } } },
        },
        meta: {
            user_count: { alias: 'Người Dùng' },
            revenue: { alias: 'Doanh Thu' },
        },
    };

    return (
        <div className="shadow-md">
            {/* Tiêu đề được chuyển vào trong file dashboard/page.tsx */}
            {chartData.length > 0 ? (
                <DualAxes {...dualAxesConfig} />
            ) : (
                <Empty
                    description="Không có dữ liệu hiển thị cho khoảng thời gian này."
                    className="p-10"
                />
            )}
        </div>
    );
}