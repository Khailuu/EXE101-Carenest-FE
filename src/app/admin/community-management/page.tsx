"use client";

import { useState, JSX } from 'react';
import { Card, Table, Input, Button, Tag, Row, Col, Tooltip, Modal, Descriptions, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../components/AdminLayout'; 

type ReportStatus = 'Đang xử lý' | 'Đã xử lý' | 'Từ chối';
type ReportSeverity = 'Khẩn cấp' | 'Cao' | 'Thấp';

interface ReportData {
    key: string;
    code: string;
    type: string; // Loại vi phạm
    target: string; // Đối tượng bị báo cáo (Cửa hàng/Người dùng)
    reporter: string; // Người báo cáo
    content: string; // Nội dung
    severity: ReportSeverity;
    time: string; // Thời gian báo cáo
    status: ReportStatus;
}

const initialReportData: ReportData[] = [
    { key: '1', code: 'RP001', type: 'Lừa đảo', target: 'Shop Pet ABC', reporter: 'Trần Thị B', content: 'Lừa tiền đặt cọc', severity: 'Khẩn cấp', time: '2 giờ trước', status: 'Từ chối' },
    { key: '2', code: 'RP002', type: 'Hành hạ thú cưng', target: 'Bãi đống #TDAS', reporter: 'Anonymuous', content: 'Đánh chó trong video', severity: 'Cao', time: '3 ngày trước', status: 'Đang xử lý' },
    { key: '3', code: 'RP003', type: 'Spam/Rao vặt', target: 'User: Nguyễn Văn A', reporter: 'Phan Thị Y', content: 'Flood 50 đánh giá 5 sao', severity: 'Thấp', time: '2 tuần trước', status: 'Đã xử lý' },
    { key: '4', code: 'RP004', type: 'Nội dung bạo lực', target: 'Shop Pet XYZ', reporter: 'Lê Văn C', content: 'Đăng ảnh động vật bị thương', severity: 'Cao', time: '1 tuần trước', status: 'Đã xử lý' },
];

const ReportStatusColors: Record<ReportStatus, string> = {
    'Đang xử lý': 'processing',
    'Đã xử lý': 'success',
    'Từ chối': 'error',
};

const ReportSeverityColors: Record<ReportSeverity, string> = {
    'Khẩn cấp': 'red',
    'Cao': 'orange',
    'Thấp': 'blue',
};

const renderStatusTag = (status: ReportStatus): JSX.Element => (
    <Tag color={ReportStatusColors[status]} style={{ fontWeight: 'bold' }}>
        {status}
    </Tag>
);

const renderSeverityTag = (severity: ReportSeverity): JSX.Element => (
    <Tag color={ReportSeverityColors[severity]} style={{ fontWeight: 'bold' }}>
        {severity}
    </Tag>
);

// Dữ liệu thống kê 
const statsData = {
    newReports: 23,
    processing: 8,
    completed: 156,
    urgent: 3,
    lockedAccounts: 12,
    bannedShops: 5,
    ratingReports: 18,
};

const statsItems = [
    { label: 'Báo cáo mới', count: statsData.newReports },
    { label: 'Đang xử lý', count: statsData.processing },
    { label: 'Đã xử lý', count: statsData.completed },
    { label: 'Khẩn cấp', count: statsData.urgent },
    { label: 'TK bị khóa', count: statsData.lockedAccounts },
    { label: 'Shop bị đình chỉ', count: statsData.bannedShops },
    { label: 'Rating bị ảnh hưởng', count: statsData.ratingReports },
];


export default function CommunityManagementPage(): JSX.Element {
    const [reportData, setReportData] = useState<ReportData[]>(initialReportData);
    const [selectedStatusTab, setSelectedStatusTab] = useState('Tất cả');
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

    const handleViewDetails = (report: ReportData) => {
        setSelectedReport(report);
        setIsDetailModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsDetailModalVisible(false);
    };

    const handleConfirm = () => {
        // Logic xử lý xác nhận báo cáo (ví dụ: cập nhật trạng thái)
        message.success(`Đã xác nhận xử lý báo cáo ${selectedReport?.code}`);
        handleCloseModal();
    };

    const handleReject = () => {
        // Logic xử lý từ chối báo cáo
        message.error(`Đã từ chối xử lý báo cáo ${selectedReport?.code}`);
        handleCloseModal();
    };
    
    // Tính tổng số lượng cho mỗi trạng thái để hiển thị trên tabs
    const statusCounts = reportData.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
    }, {} as Record<ReportStatus, number>);

    // Lọc dữ liệu theo tab
    const filteredReportData = selectedStatusTab === 'Tất cả'
        ? reportData
        : reportData.filter(r => 
            selectedStatusTab === 'Khẩn cấp' ? r.severity === 'Khẩn cấp' : r.status === selectedStatusTab
          );

    const reportColumns: ColumnsType<ReportData> = [
        { title: 'Mã báo cáo', dataIndex: 'code', key: 'code', width: 100 },
        { title: 'Loại vi phạm', dataIndex: 'type', key: 'type', width: 150 },
        { title: 'Đối tượng bị báo cáo', dataIndex: 'target', key: 'target', width: 200 },
        { title: 'Người báo cáo', dataIndex: 'reporter', key: 'reporter', width: 150 },
        { 
            title: 'Nội dung', 
            dataIndex: 'content', 
            key: 'content', 
            width: 150,
            render: (text: string) => <Tooltip title={text}><span className="truncate block max-w-[150px]">{text}</span></Tooltip>
        },
        { 
            title: 'Mức độ', 
            dataIndex: 'severity', 
            key: 'severity', 
            render: renderSeverityTag, 
            width: 100, 
            align: 'center' 
        },
        { title: 'Thời điểm', dataIndex: 'time', key: 'time', width: 120 },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: renderStatusTag, width: 120, align: 'center' },
        {
          title: 'Thao tác',
          key: 'action',
          render: (_, record) => (
            <div className="flex gap-2 justify-center">
              <Tooltip title="Xem chi tiết">
                <Button 
                    type="text" 
                    icon={<EyeOutlined className="text-blue-500" />} 
                    onClick={() => handleViewDetails(record)}
                />
              </Tooltip>
            </div>
          ),
          width: 80,
          align: 'center'
        },
    ];

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Quản lý cộng đồng</h1>
            
            {/* Filter, Search và Date Picker */}
            <Card bordered={false} className="shadow-lg mb-6 p-4 bg-[#4A3837]">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} lg={10}>
                        <Input
                            placeholder="Tìm kiếm theo nội dung báo cáo, người báo cáo..."
                            size="large"
                            prefix={<SearchOutlined className="text-gray-500" />}
                            className="bg-white border-none"
                        />
                    </Col>
                    <Col xs={12} lg={4}>
                        {/* Placeholder DatePicker */}
                    </Col>
                    <Col xs={12} lg={4}>
                         {/* Placeholder DatePicker */}
                    </Col>
                    <Col xs={24} lg={6}>
                        <Button
                            size="large"
                            className="w-full bg-[#8B6E5A] text-white border-none hover:!bg-[#A38A73]"
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Thống kê nhanh: Đảm bảo Card đều nhau */}
            <Row gutter={[30, 16]} className="mb-6 !mt-[30px] justify-between"> 
                {statsItems.map((item, index) => (
                    <Col key={index} xs={12} sm={8} lg={3} style={{ flexGrow: 1 }}>
                        <Card 
                            className="bg-[#4A3837] text-white text-center shadow-lg" 
                            style={{ 
                                height: '100px', // Chiều cao cố định
                            }}
                            bodyStyle={{ padding: '12px 0' }}
                        >
                            <div className="text-2xl font-bold">{item.count}</div>
                            <div className="text-xs text-gray-400">{item.label}</div>
                        </Card>
                    </Col>
                ))}
            </Row>


            {/* Tabs Trạng thái */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                <Button
                    type={selectedStatusTab === 'Tất cả' ? 'primary' : 'default'}
                    onClick={() => setSelectedStatusTab('Tất cả')}
                    className={`font-semibold min-w-[120px] ${selectedStatusTab === 'Tất cả' ? 'bg-[#8B6E5A] border-[#8B6E5A] text-white !ml-[10px]' : ' !ml-[10px] text-gray-700 bg-gray-100 hover:!bg-gray-200'}`}
                >
                    Tất cả ({reportData.length})
                </Button>
                {['Đang xử lý', 'Đã xử lý', 'Từ chối', 'Khẩn cấp'].map(status => (
                    <Button
                        key={status}
                        type={selectedStatusTab === status ? 'primary' : 'default'}
                        onClick={() => setSelectedStatusTab(status)}
                        className={`font-semibold min-w-[120px] ${selectedStatusTab === status ? 'bg-[#8B6E5A] border-[#8B6E5A] text-white !ml-[10px]' : ' !ml-[10px] text-gray-700 bg-gray-100 hover:!bg-gray-200'}`}
                    >
                        {status} ({status === 'Khẩn cấp' ? statsData.urgent : statusCounts[status as ReportStatus] || 0})
                    </Button>
                ))}
            </div>

            {/* Report Table */}
            <Card className="shadow-lg p-0">
                <Table
                    columns={reportColumns}
                    dataSource={filteredReportData}
                    pagination={{ pageSize: 10 }}
                    bordered
                    className="rounded-lg overflow-hidden"
                    scroll={{ x: 1200 }}
                    footer={() => (
                        <div className="text-gray-600 font-semibold">
                            Tổng: {filteredReportData.length} báo cáo
                        </div>
                    )}
                />
            </Card>

            {/* Modal Xem chi tiết báo cáo: ĐÃ CẬP NHẬT FOOTER VÀ TIÊU ĐỀ */}
            <Modal
                title={
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#8B6E5A]">Xem chi tiết báo cáo</span>
                        <span className="text-xl font-extrabold text-[#4A3837] mt-1">{selectedReport?.code}</span>
                    </div>
                }
                open={isDetailModalVisible}
                onCancel={handleCloseModal}
                width={500}
                // Thay thế nút "Tôi biết rồi" bằng 3 nút hành động
                footer={[
                    <Button 
                        key="confirm" 
                        onClick={handleConfirm} 
                        type="primary" 
                        className="bg-green-600 hover:!bg-green-700 border-none text-white font-bold"
                    >
                        Xác nhận
                    </Button>,
                    <Button 
                        key="reject" 
                        onClick={handleReject} 
                        type="primary" 
                        className="bg-red-700 hover:!bg-red-800 border-none text-white font-bold"
                    >
                        Từ chối
                    </Button>,
                    <Button 
                        key="close" 
                        onClick={handleCloseModal} 
                        type="primary" 
                        className="bg-black hover:!bg-gray-800 border-none text-white font-bold"
                    >
                        Đóng
                    </Button>,
                ]}
            >
                {selectedReport && (
                    <Descriptions bordered column={1} size="middle" className="mt-4">
                        <Descriptions.Item label="Mã báo cáo" labelStyle={{ fontWeight: 'bold' }}>{selectedReport.code}</Descriptions.Item>
                        <Descriptions.Item label="Loại vi phạm" labelStyle={{ fontWeight: 'bold' }}>{selectedReport.type}</Descriptions.Item>
                        <Descriptions.Item label="Đối tượng bị báo cáo" labelStyle={{ fontWeight: 'bold' }}>{selectedReport.target}</Descriptions.Item>
                        <Descriptions.Item label="Người báo cáo" labelStyle={{ fontWeight: 'bold' }}>{selectedReport.reporter}</Descriptions.Item>
                        <Descriptions.Item label="Nội dung" labelStyle={{ fontWeight: 'bold' }}>{selectedReport.content}</Descriptions.Item>
                        <Descriptions.Item label="Mức độ" labelStyle={{ fontWeight: 'bold' }}>{renderSeverityTag(selectedReport.severity)}</Descriptions.Item>
                        <Descriptions.Item label="Thời điểm" labelStyle={{ fontWeight: 'bold' }}>{selectedReport.time}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái" labelStyle={{ fontWeight: 'bold' }}>{renderStatusTag(selectedReport.status)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </AdminLayout>
    );
}