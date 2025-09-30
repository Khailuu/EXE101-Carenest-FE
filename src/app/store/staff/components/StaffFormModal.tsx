import { Button, Input, Modal, Form, Upload, Row, Col, DatePicker, Select, Switch, message, Avatar } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { StaffData, StaffRole, StaffStatus } from '../page';
import { JSX, useEffect } from 'react';
import dayjs from 'dayjs';

const { Option } = Select;
const { Password } = Input;

interface StaffFormModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    editingStaff: StaffData | null;
    handleSave: (values: any) => void;
}

export default function StaffFormModal({ isModalOpen, setIsModalOpen, editingStaff, handleSave }: StaffFormModalProps): JSX.Element {
    const [form] = Form.useForm();
    const isEditing = !!editingStaff;

    useEffect(() => {
        if (isModalOpen) {
            if (editingStaff) {
                // Đổ dữ liệu vào form khi sửa/xem chi tiết
                form.setFieldsValue({
                    ...editingStaff,
                    dob: dayjs(editingStaff.dob, 'DD/MM/YYYY'),
                    startDate: dayjs(editingStaff.startDate, 'DD/MM/YYYY'),
                    // Chuyển đổi trạng thái sang boolean cho Switch
                    statusSwitch: editingStaff.status === 'Hoạt động',
                });
            } else {
                // Giá trị mặc định khi tạo mới
                form.resetFields();
                form.setFieldsValue({
                    role: 'Nhân viên', 
                    branch: 'Chi nhánh 1',
                    statusSwitch: true, // Mặc định là Hoạt động
                });
            }
        }
    }, [isModalOpen, editingStaff, form]);

    const onFinish = (values: any) => {
        const finalValues = {
            ...values,
            // Format lại ngày tháng trước khi lưu
            dob: values.dob?.format('DD/MM/YYYY'),
            startDate: values.startDate?.format('DD/MM/YYYY'),
            // Chuyển đổi Switch lại thành string 'Hoạt động'/'Tạm khóa'
            status: values.statusSwitch ? 'Hoạt động' : 'Tạm khóa',
        };
        handleSave(finalValues);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    // Hàm giả lập logic đổi mật khẩu
    const handlePasswordChange = () => {
        form.validateFields(['newPassword', 'confirmPassword'])
            .then(values => {
                console.log('Đổi mật khẩu cho nhân viên:', editingStaff?.name, values);
                message.success('Đã đổi mật khẩu thành công!');
                // Reset chỉ trường mật khẩu
                form.setFieldsValue({ newPassword: undefined, confirmPassword: undefined });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    // Tiêu đề Modal
    const modalTitle = isEditing 
        ? `Chi tiết tài khoản: ${editingStaff?.name}` 
        : 'Tạo tài khoản nhân viên mới';

    return (
        <Modal
            title={modalTitle}
            open={isModalOpen}
            onCancel={handleCancel}
            width={isEditing ? 800 : 500} // Modal rộng hơn khi chỉnh sửa
            footer={isEditing ? null : [ // Bỏ footer khi Editing, dùng nút Lưu trong Form
                <Button key="back" onClick={handleCancel}>Hủy</Button>,
                <Button key="submit" type="primary" onClick={form.submit} className='bg-green-500 hover:bg-green-600'>
                    Tạo tài khoản
                </Button>,
            ]}
            centered
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    {/* Cột Chi tiết/Tạo mới (Bên Trái) */}
                    <Col span={isEditing ? 12 : 24}>
                        <h3 className="text-lg font-bold text-gray-700 mb-4">
                            {isEditing ? 'Thông tin cơ bản' : 'Thông tin đăng nhập'}
                        </h3>
                        
                        {/* Avatar */}
                        {isEditing && (
                             <Form.Item label="Ảnh đại diện">
                                <div className="flex items-center space-x-4 mb-4">
                                    <Avatar size={64} src={editingStaff?.avatar} />
                                    <Upload beforeUpload={() => false} maxCount={1} showUploadList={false}>
                                        <Button icon={<UploadOutlined />}>Đổi ảnh</Button>
                                    </Upload>
                                </div>
                            </Form.Item>
                        )}
                        
                        <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input disabled={isEditing} /> {/* Email không thay đổi khi sửa */}
                        </Form.Item>

                        {/* Các trường chỉ hiện khi TẠO MỚI */}
                        {!isEditing && (
                            <>
                                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                                    <Password />
                                </Form.Item>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Xác nhận mật khẩu"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Password />
                                </Form.Item>
                            </>
                        )}

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="dob" label="Ngày sinh">
                                    <DatePicker format="DD/MM/YYYY" className="w-full" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="startDate" label="Ngày bắt đầu làm việc">
                                    <DatePicker format="DD/MM/YYYY" className="w-full" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="branch" label="Chi nhánh làm việc">
                            <Select>
                                <Option value="Chi nhánh 1">Chi nhánh 1</Option>
                                <Option value="Chi nhánh 2">Chi nhánh 2</Option>
                            </Select>
                        </Form.Item>
                        
                        <Form.Item name="role" label="Vai trò">
                            <Select>
                                <Option value="Quản lý">Quản lý</Option>
                                <Option value="Nhân viên">Nhân viên</Option>
                            </Select>
                        </Form.Item>
                        
                        <Form.Item name="statusSwitch" label="Trạng thái tài khoản" valuePropName="checked">
                             <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm khóa" />
                        </Form.Item>
                        
                        {/* Nút Lưu chỉ hiện khi SỬA */}
                        {isEditing && (
                            <Form.Item className="mt-4">
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className='bg-teal-500 hover:bg-teal-600 w-full'>
                                    Lưu Thay Đổi
                                </Button>
                            </Form.Item>
                        )}

                    </Col>
                    
                    {/* Cột Đổi mật khẩu (Bên Phải) - Chỉ hiện khi SỬA */}
                    {isEditing && (
                        <Col span={12} className="border-l pl-6">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">
                                Đổi mật khẩu
                            </h3>
                            
                            <Form.Item
                                name="newPassword"
                                label="Mật khẩu mới"
                                rules={[{ required: false, message: 'Vui lòng nhập mật khẩu mới!' }]}
                            >
                                <Password />
                            </Form.Item>
                            
                            <Form.Item
                                name="confirmPassword"
                                label="Xác nhận mật khẩu mới"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: false },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!getFieldValue('newPassword') || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Password />
                            </Form.Item>

                            <Button onClick={handlePasswordChange} className='w-full'>
                                Xác nhận đổi mật khẩu
                            </Button>
                        </Col>
                    )}
                </Row>
            </Form>
        </Modal>
    );
};