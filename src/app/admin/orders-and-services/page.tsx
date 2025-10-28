"use client";

import React, { useState, JSX, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Tag,
  Row,
  Col,
  DatePicker,
  message,
  Tooltip,
  Modal,
  Descriptions,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import AdminLayout from "../components/AdminLayout";
import dayjs from "dayjs";
import {
  appointmentService,
  Appointment,
  AppointmentQueryParams,
} from "../../../services/appointmentService";

const { RangePicker } = DatePicker;

type OrderStatus = Appointment["status"];

interface OrderData extends Appointment {
  key: string;
  customer: string;
}

const OrderStatusColors: Record<OrderStatus, string> = {
  "Chờ xác nhận": "processing",
  "Đã xác nhận": "blue",
  "Đang tiến hành": "gold",
  "Hoàn thành": "success",
  "Hủy bỏ": "error",
  "Tranh chấp": "warning",
};

const formatCurrency = (amount: number | null | undefined): string => {
  const safeAmount = amount ?? 0;
  return `${safeAmount.toLocaleString()}₫`;
};

const renderStatusTag = (status: OrderStatus): JSX.Element => (
  <Tag color={OrderStatusColors[status]} style={{ fontWeight: "bold" }}>
    {status}
  </Tag>
);

const statsData = {
  totalToday: 45,
  pending: 12,
  inProgress: 8,
  completed: 156,
  revenueToday: 2450000,
  commissionToday: 367500,
  revenueMonth: 45650000,
  commissionMonth: 6847500,
  totalCompletedOrders: 1123,
};

export default function OrdersAndServicesPage(): JSX.Element {
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("Tất cả");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState<AppointmentQueryParams>({
    search: undefined,
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    page: 1,
    pageSize: 10,
  });

  // ✅ Fetch API (không còn dependency selectedStatusTab để tránh gọi lại)
  const fetchOrders = useCallback(
    async (statusOverride?: string) => {
      setLoading(true);
      try {
        const statusFilter =
          statusOverride === undefined
            ? selectedStatusTab === "Tất cả"
              ? undefined
              : selectedStatusTab
            : statusOverride;

        const params: AppointmentQueryParams = { ...filters, status: statusFilter };
        const response = await appointmentService.getAppointments(params);

        const mappedData: OrderData[] = response.data.items
          .map((item) => ({
            ...item,
            key: item.id,
            customer: `Khách hàng ID: ${item.customerId.substring(0, 8)}...`,
          }))
          // ✅ Sắp xếp theo thời gian gần nhất
          .sort(
            (a, b) =>
              dayjs(b.startTime).valueOf() - dayjs(a.startTime).valueOf()
          );

        setOrderData(mappedData);
        setPagination((prev) => ({
          ...prev,
          total: response.data.totalItems,
          page: response.data.currentPage,
          pageSize: response.data.pageSize,
        }));
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        message.error("Lỗi khi tải danh sách lịch hẹn.");
        setOrderData([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // ✅ Gọi API khi thay đổi filter (page, search, date...)
  useEffect(() => {
    fetchOrders();
  }, [filters, fetchOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleSearchClick = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleDateRangeChange = (dates: any) => {
    const [start, end] = dates || [null, null];
    setFilters((prev) => ({
      ...prev,
      startDate: start ? start.format("YYYY-MM-DD") : undefined,
      endDate: end ? end.format("YYYY-MM-DD") : undefined,
      page: 1,
    }));
  };

  const handleTableChange = (newPagination: any) => {
    setFilters((prev) => ({
      ...prev,
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleStatusTabClick = (status: string) => {
    setSelectedStatusTab(status);
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchOrders(status); // ✅ Chỉ fetch đúng 1 lần cho tab đó
  };

  const handleViewDetails = (order: OrderData) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Tất_cả: pagination.total };
    orderData.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orderData, pagination.total]);

  const orderColumns: ColumnsType<OrderData> = [
    {
      title: "Mã đặt lịch",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => id.substring(0, 8) + "...",
    },
    { title: "Khách hàng", dataIndex: "customer", key: "customer", width: 150 },
    { title: "Cửa hàng", dataIndex: "shopName", key: "shopName", width: 150 },
    {
      title: "Thời gian",
      dataIndex: "startTime",
      key: "startTime",
      width: 180,
      render: (time: string) => dayjs(time).format("HH:mm - DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
      width: 120,
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 100,
      align: "right",
      render: formatCurrency,
    },
    {
      title: "Nhân viên",
      dataIndex: "staffName",
      key: "staffName",
      width: 120,
      render: (name) => name || "Chưa phân công",
    },
    {
      title: "Thao tác",
      key: "action",
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
      align: "center",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        Quản lý lịch hẹn dịch vụ
      </h1>

      {/* Filter */}
      <Card bordered={false} className="shadow-lg mb-6 p-4 bg-[#4A3837]">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} lg={12}>
            <Input
              placeholder="Tìm kiếm theo ID cuộc hẹn, cửa hàng..."
              size="large"
              prefix={<SearchOutlined className="text-gray-500" />}
              className="bg-white border-none"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </Col>
          <Col xs={24} lg={8}>
            <RangePicker
              size="large"
              className="w-full"
              onChange={handleDateRangeChange}
              placeholder={["Từ ngày", "Đến ngày"]}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} lg={4}>
            <Button
              size="large"
              className="w-full bg-[#8B6E5A] text-white border-none hover:!bg-[#A38A73]"
              onClick={handleSearchClick}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {[
          "Tất cả",
          "Chờ xác nhận",
          "Đã xác nhận",
          "Đang tiến hành",
          "Hoàn thành",
          "Hủy bỏ",
          "Tranh chấp",
        ].map((status) => (
          <Button
            key={status}
            type={selectedStatusTab === status ? "primary" : "default"}
            onClick={() => handleStatusTabClick(status)}
            className={`font-semibold min-w-[120px] ${
              selectedStatusTab === status
                ? "bg-[#8B6E5A] border-[#8B6E5A] text-white !ml-[10px]"
                : "!ml-[10px] text-gray-700 bg-gray-100 hover:!bg-gray-200"
            }`}
          >
            {status} ({statusCounts[status] || 0})
          </Button>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-lg p-0">
        <Table
          columns={orderColumns}
          dataSource={orderData}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          loading={loading}
          onChange={handleTableChange}
          bordered
          className="rounded-lg overflow-hidden"
          scroll={{ x: 1300 }}
          footer={() => (
            <div className="text-gray-600 font-semibold">
              Tổng số cuộc hẹn: {pagination.total}
            </div>
          )}
        />
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title={`Chi tiết cuộc hẹn: ${selectedOrder?.id?.substring(0, 8)}...`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={700}
        footer={[
          <Button
            key="back"
            onClick={() => setIsDetailModalVisible(false)}
            type="primary"
            className="bg-gray-700 hover:!bg-gray-600 border-none"
          >
            Đóng
          </Button>,
        ]}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered column={2} size="small" className="mt-4 mb-4">
              <Descriptions.Item label="Mã đặt lịch" labelStyle={{ fontWeight: "bold" }}>
                {selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" labelStyle={{ fontWeight: "bold" }}>
                {renderStatusTag(selectedOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng" labelStyle={{ fontWeight: "bold" }}>
                {selectedOrder.customer}
              </Descriptions.Item>
              <Descriptions.Item label="Cửa hàng" labelStyle={{ fontWeight: "bold" }}>
                {selectedOrder.shopName}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian hẹn" labelStyle={{ fontWeight: "bold" }}>
                {dayjs(selectedOrder.startTime).format("HH:mm - DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Nhân viên" labelStyle={{ fontWeight: "bold" }}>
                {selectedOrder.staffName || "Chưa phân công"}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức TT" labelStyle={{ fontWeight: "bold" }}>
                {selectedOrder.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Đã thanh toán" labelStyle={{ fontWeight: "bold" }}>
                {selectedOrder.isPaid ? "Rồi" : "Chưa"}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" labelStyle={{ fontWeight: "bold" }} span={2}>
                {selectedOrder.note || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" labelStyle={{ fontWeight: "bold" }} span={2}>
                <span className="text-lg font-extrabold text-[#8B6E5A]">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <h4 className="font-bold mt-4 mb-2 text-gray-700">
              Chi tiết Dịch vụ/Sản phẩm:
            </h4>
            <Table
              dataSource={selectedOrder.details.map((d, index) => ({
                ...d,
                key: index,
              }))}
              columns={[
                { title: "Tên dịch vụ/SP", dataIndex: "serviceName", key: "name" },
                {
                  title: "SL",
                  dataIndex: "quantity",
                  key: "qty",
                  width: 80,
                  align: "center",
                },
                {
                  title: "Đơn giá",
                  dataIndex: "price",
                  key: "price",
                  width: 150,
                  align: "right",
                  render: formatCurrency,
                },
                {
                  title: "Thành tiền",
                  key: "subtotal",
                  width: 150,
                  align: "right",
                  render: (_, record) =>
                    formatCurrency((record.price ?? 0) * record.quantity),
                },
              ]}
              pagination={false}
              size="small"
            />
          </>
        )}
      </Modal>
    </AdminLayout>
  );
}
