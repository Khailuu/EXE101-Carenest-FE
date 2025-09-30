import { Card, Form, Input, Button, Upload, Row, Col, TimePicker } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { JSX } from 'react';

const { TextArea } = Input;
const format = 'HH:mm';

export default function StoreInfoTab(): JSX.Element {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Thông tin cửa hàng đã lưu:', values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                storeName: 'Cửa hàng chăm sóc sức khỏe thú cưng Pettiny',
                hotline: '0901234567',
                description: 'Cửa hàng Pettiny chuyên cung cấp các dịch vụ tắm rửa, cắt tỉa, spa, và sản phẩm dinh dưỡng cao cấp cho thú cưng. Với đội ngũ nhân viên yêu động vật, tay nghề cao, chúng tôi cam kết mang lại trải nghiệm tốt nhất cho thú cưng của bạn.',
            }}
        >
            <Row gutter={24}>
                {/* Cột Trái - Thông tin chung */}
                <Col span={14}>
                    <Form.Item name="storeName" label="Tên cửa hàng">
                        <Input size="large" />
                    </Form.Item>
                    
                    <Form.Item name="hotline" label="Hotline">
                        <Input size="large" />
                    </Form.Item>
                    
                    <Form.Item name="description" label="Mô tả về cửa hàng">
                        <TextArea rows={5} placeholder="Mô tả chi tiết các dịch vụ và cam kết của cửa hàng..." />
                    </Form.Item>

                    {/* Giờ mở cửa */}
                    <h3 className="text-lg font-semibold mt-4 mb-3">Giờ mở cửa</h3>
                    <Row gutter={16}>
                        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5'].map(day => (
                            <Col span={12} key={day} className="mb-3">
                                <Row align="middle">
                                    <Col span={8}>{day}</Col>
                                    <Col span={8}>
                                        <Form.Item name={[day, 'start']} noStyle>
                                            <TimePicker format={format} placeholder="Mở cửa" className="w-full" size="small" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={[day, 'end']} noStyle>
                                            <TimePicker format={format} placeholder="Đóng cửa" className="w-full" size="small" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        ))}
                    </Row>

                </Col>

                {/* Cột Phải - Hình ảnh */}
                <Col span={10}>
                    <Form.Item label="Hình ảnh Logo/Đại diện">
                        <div className="flex items-center space-x-4">
                            <img 
                                src="https://i.pravatar.cc/100?img=1" 
                                alt="Logo" 
                                className="w-24 h-24 rounded-full border p-1 object-cover" 
                            />
                            <Upload beforeUpload={() => false} maxCount={1} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                            </Upload>
                        </div>
                    </Form.Item>
                    
                    <Form.Item label="Hình ảnh khác">
                        <Upload 
                            listType="picture-card" 
                            beforeUpload={() => false}
                        >
                            <Button type="text" icon={<UploadOutlined />}>Tải ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} className='bg-teal-500 hover:bg-teal-600 mt-4'>
                    Lưu thông tin
                </Button>
            </Form.Item>
        </Form>
    );
}