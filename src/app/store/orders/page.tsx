"use client";
import React from "react";
import { Button, Card, Table, Tag, Space, Spin, Select, Pagination, Drawer } from "antd";
import { EyeOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import ReviewModal from "./components/ReviewModal";
import { reviewService } from "@/services/reviewService";
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { shopService } from '@/services/shopService';

interface Order {
    id: string;
    customerId: string;
    shopId: string;
    shipAddressId: string;
    totalAmount: number;
    paymentMethod: string;
    note: string;
    status: number;
    bankId: string | null;
    bankTransactionId: string | null;
    isPaid: boolean;
    createdAt: string;
}

interface OrderDetail {
    id: string;
    productDetailId: string;
    orderId: string;
    quantity: number;
    totalAmount: number;
    name?: string;
}

const STATUS_MAP = {
    0: { label: 'Chưa thanh toán', color: 'orange' },
    4: { label: 'Đã thanh toán', color: 'green' },
};

const PAYMENT_METHOD_MAP = {
    'QR': 'QR Code',
    'CARD': 'Thẻ',
    'CASH': 'Tiền mặt',
};

export default function OrdersPage() {
    const shopId = useSelector((state: RootState) => state.user.shopId);

    // Filter states
    const [tempSortDirection, setTempSortDirection] = React.useState('asc');

    // Applied filter states
    const [pagination, setPagination] = React.useState({
        pageIndex: 1,
        pageSize: 10,
        sortDirection: 'asc'
    });

    // Internal state for pagination
    const [internalPagination, setInternalPagination] = React.useState({
        pageIndex: 1,
        pageSize: 10
    });

    // Sync internal state to applied state
    React.useEffect(() => {
        setPagination(prev => ({
            ...prev,
            pageIndex: internalPagination.pageIndex,
            pageSize: internalPagination.pageSize
        }));
    }, [internalPagination]);

    // Detail modal states
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
    const [detailDrawerOpen, setDetailDrawerOpen] = React.useState(false);
    const [reviewModalOpen, setReviewModalOpen] = React.useState(false);
    const [reviewOrderId, setReviewOrderId] = React.useState<string | null>(null);
    const [ordersWithReview, setOrdersWithReview] = React.useState<Record<string, boolean>>({});

    const handleApplyFilters = () => {
        setPagination(prev => ({
            ...prev,
            sortDirection: tempSortDirection
        }));
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setDetailDrawerOpen(true);
    };

    const handleViewReviews = (order: Order) => {
        setReviewOrderId(order.id);
        setReviewModalOpen(true);
    };

    // (Effect moved below ordersData declaration)

    // Fetch orders data
    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['orders', shopId, pagination.pageIndex, pagination.pageSize, pagination.sortDirection],
        queryFn: () => {
            console.log('Fetching orders with params:', {
                shopId,
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                sortDirection: pagination.sortDirection
            });
            return shopService.getOrders(shopId || '', {
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                sortDirection: pagination.sortDirection
            });
        },
        enabled: !!shopId,
    });

    // Load review existence for current page orders to color the button (after ordersData defined)
    React.useEffect(() => {
        const loadReviewFlags = async () => {
            if (!ordersData?.items || ordersData.items.length === 0) {
                setOrdersWithReview({});
                return;
            }
            const flags: Record<string, boolean> = {};
            await Promise.all(
                ordersData.items.map(async (o: Order) => {
                    try {
                        const res = await reviewService.getReviews({ orderId: o.id, pageIndex: 1, pageSize: 1, sortDirection: 'asc' });
                        flags[o.id] = (res?.data?.items?.length || 0) > 0;
                    } catch {
                        flags[o.id] = false;
                    }
                })
            );
            setOrdersWithReview(flags);
        };
        loadReviewFlags();
    }, [ordersData?.items]);

    // Debug effect
    React.useEffect(() => {
        console.log('Pagination state changed:', pagination);
        console.log('Orders data:', ordersData);
    }, [pagination, ordersData]);

    // Fetch order details
    const { data: orderDetailsData, isLoading: detailsLoading } = useQuery({
        queryKey: ['orderDetails', selectedOrder?.id],
        queryFn: () => shopService.getOrderDetails(selectedOrder?.id || '', {
            pageIndex: 1,
            pageSize: 50,
        }),
        enabled: !!selectedOrder?.id,
    });

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const detailColumns = [
        {
            title: 'ID Chi tiết',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            render: (text: string) => <span className="font-mono text-xs">{text.slice(0, 8)}...</span>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string) => <span className="font-medium">{name || 'N/A'}</span>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
            render: (qty: number) => <span className="font-semibold">{qty}</span>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 120,
            render: (amount: number) => <span className="font-semibold text-green-600">{formatCurrency(amount)}</span>,
        },
    ];

    const columns = [
        {
            title: 'ID Đơn hàng',
            dataIndex: 'id',
            key: 'id',
            width: "10%",
            render: (text: string) => <span className="font-mono text-xs">{text.slice(0, 8)}...</span>,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerId',
            key: 'customerId',
            width: 120,
            render: (text: string) => <span className="text-sm">{text}</span>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 100,
            render: (amount: number) => <span className="font-semibold text-green-600">{formatCurrency(amount)}</span>,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: "10%",
            render: (method: string) => <Tag color="blue">{PAYMENT_METHOD_MAP[method as keyof typeof PAYMENT_METHOD_MAP] || method}</Tag>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: "15%",
            render: (status: number) => {
                const statusInfo = STATUS_MAP[status as keyof typeof STATUS_MAP] || { label: 'Không xác định', color: 'default' };
                return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            fixed: 'right' as const,
            render: (ya_: any, record: Order) => (
                <Space>
                    <Button 
                        type="primary" 
                        size="small" 
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                    >
                        Xem
                    </Button>
                    <Button 
                        size="small"
                        type={ordersWithReview[record.id] ? 'primary' : 'default'}
                        className={ordersWithReview[record.id] ? 'bg-[#FFF44F]! border-[#FFF44F]! hover:bg-[#F6E94B]! hover:border-[#F6E94B]! !text-black' : ''}
                        icon={ordersWithReview[record.id] ? <StarFilled /> : <StarOutlined />}
                        onClick={() => handleViewReviews(record)}
                    >
                        Đánh giá
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Filter Card */}
            <Card className="mb-6 rounded-xl shadow-sm">
                <div className="text-lg font-semibold mb-4">Bộ lọc đơn hàng</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Sắp xếp</label>
                        <Select
                            style={{ width: '100%' }}
                            value={tempSortDirection}
                            onChange={setTempSortDirection}
                            options={[
                                { label: 'Tăng dần', value: 'asc' },
                                { label: 'Giảm dần', value: 'desc' },
                            ]}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            type="primary"
                            onClick={handleApplyFilters}
                            block
                        >
                            Áp dụng bộ lọc
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Orders Table */}
            <Card className="rounded-xl shadow-sm">
                <Spin spinning={ordersLoading}>
                    <Table
                        columns={columns}
                        dataSource={ordersData?.items || []}
                        rowKey="id"
                        pagination={false}
                        scroll={{ x: 1200 }}
                        className="rounded-lg"
                    />
                </Spin>
            </Card>

            {/* Pagination */}
            {ordersData && (
                <Card className="mt-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            Tổng {ordersData.totalItems} đơn hàng • Trang {pagination.pageIndex} • Size {pagination.pageSize}
                        </span>
                        <Pagination
                            current={internalPagination.pageIndex}
                            pageSize={internalPagination.pageSize}
                            total={ordersData.totalItems}
                            onChange={(page, size) => {
                                setInternalPagination(prev => ({
                                    ...prev,
                                    pageIndex: page,
                                    pageSize: size || prev.pageSize
                                }));
                            }}
                            onShowSizeChange={(current, size) => {
                                setInternalPagination(prev => ({
                                    ...prev,
                                    pageIndex: 1,
                                    pageSize: size
                                }));
                            }}
                            showSizeChanger={true}
                            pageSizeOptions={['10', '20', '50']}
                        />
                    </div>
                </Card>
            )}

            {/* Order Details Drawer */}
            <Drawer
                title={`Chi tiết đơn hàng - ${selectedOrder?.id?.slice(0, 8)}...`}
                placement="right"
                onClose={() => {
                    setDetailDrawerOpen(false);
                    setSelectedOrder(null);
                }}
                open={detailDrawerOpen}
                width={800}
            >
                {selectedOrder && (
                    <Spin spinning={detailsLoading}>
                        <div className="space-y-6">
                            {/* Order Info */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">ID Đơn hàng:</span>
                                        <span className="font-mono">{selectedOrder.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Khách hàng:</span>
                                        <span>{selectedOrder.customerId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tổng tiền:</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(selectedOrder.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phương thức thanh toán:</span>
                                        <span>{PAYMENT_METHOD_MAP[selectedOrder.paymentMethod as keyof typeof PAYMENT_METHOD_MAP] || selectedOrder.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        <Tag color={STATUS_MAP[selectedOrder.status as keyof typeof STATUS_MAP]?.color || 'default'}>
                                            {STATUS_MAP[selectedOrder.status as keyof typeof STATUS_MAP]?.label || 'Không xác định'}
                                        </Tag>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày tạo:</span>
                                        <span>{formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                    {selectedOrder.note && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ghi chú:</span>
                                            <span>{selectedOrder.note}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Details Table */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Chi tiết sản phẩm</h3>
                                <Table
                                    columns={detailColumns}
                                    dataSource={orderDetailsData?.items || []}
                                    rowKey="id"
                                    pagination={false}
                                    size="small"
                                />
                                {orderDetailsData?.items && orderDetailsData.items.length > 0 && (
                                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-end">
                                            <span className="text-lg font-semibold">
                                                Tổng cộng: {formatCurrency(
                                                    orderDetailsData.items.reduce((sum, item) => sum + item.totalAmount, 0)
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Spin>
                )}
                        </Drawer>
                        <ReviewModal
                            open={reviewModalOpen}
                            orderId={reviewOrderId || undefined}
                            onCloseAction={() => {
                                setReviewModalOpen(false);
                                setReviewOrderId(null);
                            }}
                        />
        </div>
    );
}