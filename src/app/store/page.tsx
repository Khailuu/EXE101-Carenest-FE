"use client";
import React from 'react';
import { Card, Row, Col, Progress, Avatar, Spin, Input, Select, Button } from "antd";
import {
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  StarOutlined,
  CloseCircleOutlined,
  FilterOutlined
} from "@ant-design/icons";
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { shopService } from '@/services/shopService';

export default function DashboardPage() {
  const shopId = useSelector((state: RootState) => state.user.shopId);

  // Temporary filter states (chưa được áp dụng)
  const [tempPageIndex, setTempPageIndex] = React.useState(1);
  const [tempPageSize, setTempPageSize] = React.useState(10);
  const [tempSortBy, setTempSortBy] = React.useState('createdAt');
  const [tempSortDirection, setTempSortDirection] = React.useState('asc');
  const [tempOrdersLimit, setTempOrdersLimit] = React.useState(5);
  const [tempOrdersSortBy, setTempOrdersSortBy] = React.useState('createdAt');
  const [tempOrdersSortDirection, setTempOrdersSortDirection] = React.useState('desc');
  const [tempOrderId, setTempOrderId] = React.useState('');

  // Applied filter states (được áp dụng khi ấn nút)
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [ordersLimit, setOrdersLimit] = React.useState(5);
  const [ordersSortBy, setOrdersSortBy] = React.useState('createdAt');
  const [ordersSortDirection, setOrdersSortDirection] = React.useState('desc');
  const [orderId, setOrderId] = React.useState('');

  // Hàm áp dụng bộ lọc
  const handleApplyFilters = () => {
    setPageIndex(tempPageIndex);
    setPageSize(tempPageSize);
    setSortBy(tempSortBy);
    setSortDirection(tempSortDirection);
    setOrdersLimit(tempOrdersLimit);
    setOrdersSortBy(tempOrdersSortBy);
    setOrdersSortDirection(tempOrdersSortDirection);
    setOrderId(tempOrderId);
  };

  // Fetch order dashboard data with filters
  const { data: dashboardData, isLoading: dashboardLoading, refetch } = useQuery({
    queryKey: ['orderDashboard', shopId, pageIndex, pageSize, sortBy, sortDirection, ordersLimit, ordersSortBy, ordersSortDirection, orderId],
    queryFn: () => shopService.getOrderDashboard(shopId || '', {
      pageIndex,
      pageSize,
      sortBy,
      sortDirection,
      ordersLimit,
      ordersSortBy,
      ordersSortDirection,
      orderId: orderId || undefined
    }),
    enabled: !!shopId,
  });

  
  // Calculate stats from API response
  const stats = React.useMemo(() => {

    console.log(dashboardData?.shopDetail);
    if (!dashboardData?.shopDetail) {
      return {
        todayAppointments: 0,
        pendingConfirmation: 0,
        inProgress: 0,
        completedCount: 0,
        monthlyRevenue: 0,
        commissionRevenue: 0,
        dailyRevenue: 0,
        earnedCommission: 0,
        completedOrders: 0,
        currentTotalRevenue: 0,
        totalUsers: 0,
        totalReviews: 0,
        averageRating: 0,
      };
    }

    const shopStats = dashboardData.shopDetail;
    const totalOrders = shopStats.totalOrders;
    const completed = shopStats.totalOrdersCompleted;
    const cancelled = shopStats.totalOrdersCancelled;
    const inProgress = totalOrders - completed - cancelled; // Tính toán đang xử lý
    const pending = Math.max(0, inProgress - 5); // Giả lập chờ xác nhận (có thể điều chỉnh)

    return {
      todayAppointments: totalOrders,
      pendingConfirmation: pending,
      inProgress: inProgress,
      completedCount: completed,
      cancelledCount: cancelled, // Thêm cancelled count
      monthlyRevenue: shopStats.totalRevenue, // Đã là VND
      commissionRevenue: shopStats.totalRevenue * 0.8, // Giả lập doanh thu tháng trước (80% của tháng này)
      dailyRevenue: shopStats.totalRevenue * 0.1, // Giả lập doanh thu hôm nay (10% của tháng này)
      earnedCommission: shopStats.totalRevenue * 0.05, // Giả lập hoa hồng (5% của tháng này)
      completedOrders: completed,
      currentTotalRevenue: shopStats.totalRevenue,
      totalUsers: shopStats.totalSeller,
      totalReviews: dashboardData.reviewCount || 0,
      averageRating: 4.5, // Mock rating
    };
  }, [dashboardData]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {dashboardLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
      {/* Thống kê tài chính */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-xl shadow-sm">
            <div>
              <div className="text-gray-500 text-sm mb-1">Tổng doanh thu life time</div>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(stats.monthlyRevenue)}
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
              <div className="text-gray-500 text-sm mb-1">Số lượng giao dịch thành công</div>
              <div className="text-2xl font-bold text-teal-500">
                {stats.completedOrders.toLocaleString()}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-xl shadow-sm">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-2">Doanh thu lũy kế</div>
              <div className="text-3xl font-bold text-orange-500">
                {formatCurrency(stats.currentTotalRevenue)}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Thẻ trạng thái đơn hàng */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="text-center">
              <div className="text-blue-500 text-sm mb-1">Tổng đơn hàng hôm nay</div>
              <div className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-orange-500">
            <div className="text-center">
              <div className="text-orange-500 text-sm mb-1">Đơn hàng Chờ xác nhận</div>
              <div className="text-3xl font-bold text-orange-600">{stats.pendingConfirmation}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-gray-500">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">Đơn hàng Đang xử lý</div>
              <div className="text-3xl font-bold text-gray-600">{stats.inProgress}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="text-center">
              <div className="text-green-500 text-sm mb-1">Đơn hàng Hoàn thành</div>
              <div className="text-3xl font-bold text-green-600">{stats.completedCount}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="h-full rounded-xl shadow-sm border-l-4 border-red-500">
            <div className="text-center">
              <CloseCircleOutlined className="text-red-500 text-lg mb-2" />
              <div className="text-red-500 text-sm mb-1">Đơn hàng Đã hủy</div>
              <div className="text-3xl font-bold text-red-600">{stats.cancelledCount}</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24}>
          <Card title="Bộ lọc danh sách đơn hàng" className="rounded-xl shadow-sm">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <div className="mb-2 text-sm font-medium">Tìm kiếm Order ID</div>
                <Input 
                  placeholder="Nhập Order ID"
                  value={tempOrderId}
                  onChange={(e) => setTempOrderId(e.target.value)}
                />
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <div className="mb-2 text-sm font-medium">Sắp xếp theo</div>
                <Select 
                  style={{ width: '100%' }}
                  value={tempSortBy}
                  onChange={setTempSortBy}
                  options={[
                    { label: 'Tên cửa hàng', value: 'shopName' },
                    { label: 'Tổng đơn hàng', value: 'totalOrders' },
                    { label: 'Tổng chi tiết', value: 'totalOrderDetails' },
                    { label: 'Ngày tạo', value: 'createdAt' },
                    { label: 'Tổng tiền', value: 'totalAmount' },
                    { label: 'Số lượng', value: 'quantity' },
                    { label: 'Tên sản phẩm', value: 'productName' },
                  ]}
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div className="mb-2 text-sm font-medium">Thứ tự</div>
                <Select 
                  style={{ width: '100%' }}
                  value={tempSortDirection}
                  onChange={setTempSortDirection}
                  options={[
                    { label: 'Tăng dần', value: 'asc' },
                    { label: 'Giảm dần', value: 'desc' },
                  ]}
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div className="mb-2 text-sm font-medium">Số item/trang</div>
                <Select 
                  style={{ width: '100%' }}
                  value={tempPageSize}
                  onChange={setTempPageSize}
                  options={[
                    { label: '10', value: 10 },
                    { label: '20', value: 20 },
                    { label: '50', value: 50 },
                  ]}
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div className="mb-2 text-sm font-medium">Giới hạn Orders</div>
                <Input 
                  type="number"
                  placeholder="100"
                  value={tempOrdersLimit}
                  onChange={(e) => setTempOrdersLimit(Number(e.target.value))}
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div className="mb-2 text-sm font-medium">Sắp xếp Orders</div>
                <Select 
                  style={{ width: '100%' }}
                  value={tempOrdersSortBy}
                  onChange={setTempOrdersSortBy}
                  options={[
                    { label: 'Ngày tạo', value: 'createdAt' },
                    { label: 'Số chi tiết', value: 'orderDetailCount' },
                  ]}
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div className="mb-2 text-sm font-medium">Thứ tự Orders</div>
                <Select 
                  style={{ width: '100%' }}
                  value={tempOrdersSortDirection}
                  onChange={setTempOrdersSortDirection}
                  options={[
                    { label: 'Tăng dần', value: 'asc' },
                    { label: 'Giảm dần', value: 'desc' },
                  ]}
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <div className="mb-2 text-sm font-medium">Trang</div>
                <Input 
                  type="number"
                  placeholder="1"
                  value={tempPageIndex}
                  onChange={(e) => setTempPageIndex(Number(e.target.value))}
                />
              </Col>

              <Col xs={24} lg={24}>
                <Button 
                  type="primary" 
                  icon={<FilterOutlined />}
                  onClick={handleApplyFilters}
                  block
                >
                  Áp dụng bộ lọc
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Danh sách đơn hàng */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24}>
          <Card title="Danh sách đơn hàng gần đây" className="rounded-xl shadow-sm">
            <div className="space-y-4">
              {dashboardData?.shopDetail?.details?.items?.slice(0, 5).map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.productName}</div>
                      <div className="text-sm text-gray-500">
                        Số lượng: {item.quantity} • Đơn giá: {formatCurrency(item.price)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{formatCurrency(item.totalAmount)}</div>
                    <div className="text-xs text-gray-500">ID: {item.id}</div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  Không có đơn hàng nào
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Phân tích tài chính chi tiết */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Card title="Phân tích doanh thu chi tiết" className="h-full rounded-xl shadow-sm">
            <div className="text-center">
              <div className="space-y-3 text-left pt-2">
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
        </>
      )}
    </div>
  );
}