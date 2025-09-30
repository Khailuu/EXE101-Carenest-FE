// src/app/store/info/components/StoreInfoPasswordTab.tsx

import { Form, Input, Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { JSX } from 'react';

export default function StoreInfoPasswordTab(): JSX.Element {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        // Giả lập logic đổi mật khẩu
        console.log('Mật khẩu đã được đổi:', values);
        message.success('Đã đổi mật khẩu thành công!');
        form.resetFields();
    };

    return (
        <div className="max-w-md mx-auto">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="oldPassword"
                    label="Mật khẩu cũ"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                >
                    <Input.Password size="large" />
                </Form.Item>
                
                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                    <Input.Password size="large" />
                </Form.Item>
                
                <Form.Item
                    name="confirmNewPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} className='bg-teal-500 hover:bg-teal-600 w-full mt-4'>
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}