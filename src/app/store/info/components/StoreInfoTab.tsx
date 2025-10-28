"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Row, Col, TimePicker, message, Spin } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { JSX } from "react";
import dayjs from "dayjs";
import { Shop, shopService } from "@/services/shopService";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const { TextArea } = Input;
const format = "HH:mm";

export default function StoreInfoTab(): JSX.Element {
    const [form] = Form.useForm();
    const shopId = useSelector((state: RootState) => state.user.shopId);
    const [shopInfo, setShopInfo] = useState<Shop | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShopInfo = async () => {
            if (shopId) {
                setIsLoading(true);
                setError(null);
                try {
                    const info = await shopService.getShopById(shopId);
                    setShopInfo(info);
                    form.setFieldsValue({
                        storeName: info.name,
                        hotline: info.ownerId,
                        description: info.description,
                        workingDays: info.workingDays,
                        imgUrl: info.imgUrl,
                    });
                } catch (err) {
                    setError("Không thể tải dữ liệu cửa hàng.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
                setError("Không tìm thấy Shop ID.");
            }
        };
        fetchShopInfo();
    }, [shopId, form]);

    const onFinish = (values: any) => {
        message.success("Lưu thông tin thành công!");
    };

    if (isLoading) return <Spin tip="Đang tải thông tin cửa hàng..." />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!shopInfo) return <p className="text-red-500">Không có thông tin cửa hàng để hiển thị.</p>;

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={14}>
                    <Form.Item name="storeName" label="Tên cửa hàng">
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item name="hotline" label="Hotline">
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả về cửa hàng">
                        <TextArea rows={5} />
                    </Form.Item>

                    <Form.Item name="workingDays" label="Ngày làm việc">
                        <Input placeholder="VD: Thứ 2 - Thứ 7" />
                    </Form.Item>

                    <h3 className="text-lg font-semibold mt-4 mb-3">Giờ mở cửa (demo)</h3>
                    <Row gutter={16}>
                        {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5"].map((day) => (
                            <Col span={12} key={day} className="mb-3">
                                <Row align="middle">
                                    <Col span={8}>{day}</Col>
                                    <Col span={8}>
                                        <Form.Item name={[day, "start"]} noStyle>
                                            <TimePicker format={format} placeholder="Mở cửa" className="w-full" size="small" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={[day, "end"]} noStyle>
                                            <TimePicker format={format} placeholder="Đóng cửa" className="w-full" size="small" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col span={10}>
                    <Form.Item label="Hình ảnh Logo/Đại diện">
                        <div className="flex items-center space-x-4">
                            <img
                                src={shopInfo.imgUrl || "https://placehold.co/100x100?text=No+Logo"}
                                alt="Logo"
                                className="w-24 h-24 rounded-full border p-1 object-cover"
                            />
                            <Upload beforeUpload={() => false} maxCount={1} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                            </Upload>
                        </div>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} className="bg-teal-500 hover:bg-teal-600 mt-4">
                    Lưu thông tin
                </Button>
            </Form.Item>
        </Form>
    );
}
