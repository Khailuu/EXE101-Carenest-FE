// src/app/store/orders/components/OrderActionModals.tsx

import { Modal, Form, Select, Button, Descriptions, Space, Divider, Tag, Row, Col } from 'antd';
import { useOrderData, ServiceOrder, ProductOrder, OrderType, formatCurrency, getStatusConfig, mockStaff } from '../hooks/useOrderData';
import { EnvironmentOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

interface OrderActionModalsProps extends ReturnType<typeof useOrderData> {
    // Kế thừa các props từ hook
}

// --- Component Modal Xác nhận/Hủy Dịch vụ ---
const ConfirmationModal: React.FC<OrderActionModalsProps> = ({
    isModalOpen, currentOrder, modalType, form, closeModal, handleServiceAction
}) => {
    if (!currentOrder || (modalType !== 'confirm_service' && modalType !== 'cancel_service')) {
        return null;
    }

    const isConfirm = modalType === 'confirm_service';
    const staffName = mockStaff.find(s => s.id === (currentOrder as ServiceOrder).staffId)?.name;

  
    return (
        <Modal
            title={isConfirm ? "Xác nhận Lịch hẹn" : "Hủy Đơn"}
            open={isModalOpen}
            onCancel={closeModal}
            footer={null} 
            width={500}
        >
            <p className="mb-4 text-lg font-semibold text-gray-700">
                Đơn <span className="text-teal-600">SV{currentOrder.key}</span> của khách hàng: {currentOrder.customer}
            </p>

            <Form form={form} onFinish={(values) => handleServiceAction({...values, newStatus: isConfirm ? 'processing' : 'cancelled'})} layout="vertical">
                
                {isConfirm && (
                    <Form.Item
                        name="staffId"
                        label={<><UserOutlined className="mr-1" /> Chọn Nhân viên thực hiện</>}
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
                        initialValue={staffName} // Nếu có nhân viên đã được gán trước đó
                    >
                        <Select placeholder="Chọn nhân viên">
                            {mockStaff.map(staff => (
                                <Option key={staff.id} value={staff.id}>{staff.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {!isConfirm && (
                    <Form.Item
                        name="reason"
                        label="Lý do hủy"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do hủy!' }]}
                    >
                        <Select placeholder="Chọn hoặc nhập lý do">
                            <Option value="Khách hàng hủy">Khách hàng hủy</Option>
                            <Option value="Không có nhân viên phù hợp">Không có nhân viên phù hợp</Option>
                            <Option value="Lỗi hệ thống">Lỗi hệ thống</Option>
                        </Select>
                    </Form.Item>
                )}

                <Form.Item className="mt-6 text-right">
                    <Space>
                        <Button onClick={closeModal} className="border-gray-400">Đóng</Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            danger={!isConfirm} 
                            className={isConfirm ? 'bg-green-500 hover:!bg-green-600' : 'bg-red-600 hover:!bg-red-700'}
                        >
                            {isConfirm ? 'Xác nhận Đơn' : 'Xác nhận Hủy'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};


// --- Component Modal Xem Chi tiết ---
const DetailsModal: React.FC<OrderActionModalsProps> = ({
    isModalOpen, currentOrder, modalType, closeModal
}) => {
    if (!currentOrder || modalType !== 'details') return null;

    const isService = 'services' in currentOrder;
    console.log('Order key:', currentOrder.key, 'isService:', isService, 'has services:', 'services' in currentOrder);
    // Ép kiểu cho dễ dàng truy cập thuộc tính
    const order = currentOrder as ServiceOrder & ProductOrder; 
    const statusConfig = getStatusConfig(order.status);
    
    return (
        <Modal
            title={`Chi tiết Đơn hàng ${isService ? 'Dịch vụ SV' : 'Sản phẩm SP'}${order.key}`}
            open={isModalOpen}
            onCancel={closeModal}
            footer={<Button onClick={closeModal}>Đóng</Button>}
            width={700}
        >
            <Descriptions bordered column={1} size="small" className="mt-4">
                <Descriptions.Item label="Mã Đơn" span={2}><span className="font-bold text-teal-600">{isService ? 'SV' : 'SP'}{order.key}</span></Descriptions.Item>
                
                <Descriptions.Item label="Khách hàng">{order.customer}</Descriptions.Item>
                <Descriptions.Item label="SĐT">{order.phone}</Descriptions.Item>
                
                <Descriptions.Item label="Địa chỉ" span={2}>{order.address}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={2}>
                    <Tag icon={statusConfig.icon} color={statusConfig.color} className="font-semibold">{statusConfig.text}</Tag>
                </Descriptions.Item>

                <Divider orientation="left" className="text-teal-600 font-bold">Thông tin {isService ? 'Dịch vụ' : 'Sản phẩm'}</Divider>

                {isService ? (
                    <>
                        <Descriptions.Item label="Chi nhánh" span={2}><EnvironmentOutlined /> {order.branch}</Descriptions.Item>
                        <Descriptions.Item label="Thời gian hẹn" span={2}>{order.startTime} - {order.endTime}</Descriptions.Item>
                        <Descriptions.Item label="Dịch vụ">
                            {(order as ServiceOrder).services.map((s, i) => (
                                <div key={i}>{s.name} ({formatCurrency(s.price)}) - <span className="text-gray-500 italic text-xs">{s.note || 'Không ghi chú'}</span></div>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhân viên gán" span={2}>{mockStaff.find(s => s.id === (order as ServiceOrder & {staffId: string}).staffId)?.name || 'Chưa gán'}</Descriptions.Item>
                    </>
                ) : (
                    <>
                        <Descriptions.Item label="Sản phẩm">
                            {(order as ProductOrder).products.map((p, i) => (
                                <div key={i}>{p.name} x {p.quantity} ({formatCurrency(p.price)})</div>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phí giao hàng">{formatCurrency((order as ProductOrder).shippingFee)}</Descriptions.Item>
                        <Descriptions.Item label="Dự kiến giao">{order.expectedDelivery}</Descriptions.Item>
                    </>
                )}
                
                <Divider orientation="left" className="text-teal-600 font-bold">Thanh toán</Divider>
                <Descriptions.Item label="Tổng tiền">
                    <span className="font-bold text-red-600 text-lg">{formatCurrency(order.total)}</span>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};


// --- Component Cha (Export) ---
export default function OrderActionModals(props: OrderActionModalsProps) {
    return (
        <>
            <ConfirmationModal {...props} />
            <DetailsModal {...props} />
        </>
    );
}