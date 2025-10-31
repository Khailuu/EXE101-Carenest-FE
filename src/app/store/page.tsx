"use client";
import { Card, Row, Col, Progress, Avatar } from "antd";
import { 
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  StarOutlined
} from "@ant-design/icons";

export default function DashboardPage() {
  const mockData = {
    todayAppointments: 45, 
    pendingConfirmation: 12, 
    inProgress: 8, 
    completedCount: 156, 

    monthlyRevenue: 45650000, 
    commissionRevenue: 6847500, 
    dailyRevenue: 2450000, 
    earnedCommission: 367500, 
    completedOrders: 1023, 
    currentTotalRevenue: 45650000,

    totalUsers: 2847, // Số lượng người dùng
    totalReviews: 156, // Số lượng đánh giá
    averageRating: 4.5 // Đánh giá trung bình
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="text-center">
              <div className="text-blue-500 text-sm mb-1">Tổng cuộc hẹn hôm nay</div>
              <div className="text-3xl font-bold text-blue-600">{mockData.todayAppointments}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-orange-500">
            <div className="text-center">
              <div className="text-orange-500 text-sm mb-1">Đơn hàng/Cuộc hẹn Chờ xác nhận</div>
              <div className="text-3xl font-bold text-orange-600">{mockData.pendingConfirmation}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-gray-500">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Đơn hàng/Cuộc hẹn Đang xử lý</div>
              <div className="text-3xl font-bold text-gray-600">{mockData.inProgress}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="text-center">
              <div className="text-green-500 text-sm mb-1">Đơn hàng/Cuộc hẹn Hoàn thành</div>
              <div className="text-3xl font-bold text-green-600">{mockData.completedCount}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-xl shadow-sm">
            <div>
              <div className="text-gray-500 text-sm mb-1">Doanh thu ròng tháng này</div>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(mockData.monthlyRevenue)}
              </div>
              <div className="text-green-500 text-xs flex items-center mt-1">
                <RiseOutlined className="mr-1" />
                Tăng trưởng 35% so với tháng trước
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-xl shadow-sm">
            <div>
              <div className="text-gray-500 text-sm mb-1">Doanh thu tháng trước</div>
              <div className="text-2xl font-bold text-orange-500">
                {formatCurrency(mockData.commissionRevenue)}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-xl shadow-sm">
            <div className="h-24 flex items-center justify-center bg-gradient-to-r from-teal-50 to-green-50 rounded">
              <div className="text-center">
                <div className="text-6xl text-teal-500">📈</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-xl shadow-sm">
            <div>
              <div className="text-gray-500 text-sm mb-1">Doanh thu bán hàng hôm nay</div>
              <div className="text-2xl font-bold text-blue-500">
                {formatCurrency(mockData.dailyRevenue)}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-xl shadow-sm">
            <div>
              <div className="text-gray-500 text-sm mb-1">Hoa hồng thu được từ hệ thống</div>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(mockData.earnedCommission)}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-xl shadow-sm">
            <div>
              <div className="text-gray-500 text-sm mb-1">Số lượng giao dịch thành công</div>
              <div className="text-2xl font-bold text-teal-500">
                {mockData.completedOrders.toLocaleString()}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={12}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-yellow-500">
            <div className="text-center">
              <StarOutlined className="text-yellow-500 text-lg mb-2" />
              <div className="text-yellow-500 text-sm mb-1">Tổng số đánh giá</div>
              <div className="text-3xl font-bold text-yellow-600">{mockData.totalReviews}</div>
              <div className="text-xs text-gray-500 mt-1">⭐ {mockData.averageRating}/5</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Biểu đồ thống kê đơn hàng" className="h-full rounded-xl shadow-sm">
            <div className="text-sm text-gray-500 mb-4">Thống kê số lượng đơn hàng qua tháng</div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tháng 1</span>
                  <span className="font-medium">62% • 10.98k</span>
                </div>
                <Progress percent={62} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tháng 2</span>
                  <span className="font-medium">73% • 8.56k</span>
                </div>
                <Progress percent={73} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tháng 3</span>
                  <span className="font-medium">86% • 1.39k</span>
                </div>
                <Progress percent={86} strokeColor="#722ed1" />
              </div>
            </div>

            <div className="mt-6 h-32 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-gray-400">Biểu đồ đường thống kê (Placeholder)</div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Thống kê tổng quan tài chính" className="h-full rounded-xl shadow-sm">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-2">Doanh thu lũy kế</div>
              <div className="text-3xl font-bold text-orange-500 mb-4">
                {formatCurrency(mockData.currentTotalRevenue)}
              </div>
              
              <div className="space-y-3 text-left pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-700">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    Doanh thu Dịch vụ
                  </span>
                  <span className="font-semibold text-purple-600">75%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-700">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Doanh thu Sản phẩm
                  </span>
                  <span className="font-semibold text-green-600">25%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}