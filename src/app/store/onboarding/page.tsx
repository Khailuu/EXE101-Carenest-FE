"use client";

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Input, Button, Card, Form, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios'; // Giả định Axios có sẵn

// --- I18N Mock (Thay thế cho useTranslation để tránh lỗi import) ---
const t = (key: string) => key;

// --- Navigation Mock (Thay thế cho next/navigation/useRouter) ---
const useRouter = () => ({
    push: (path: string) => {
        window.location.href = path;
    },
});

// --- Service Types (Định nghĩa tối thiểu) ---
interface TokenPayload { sub: string; role: string[]; exp: number; userId: string }
interface ShopCreationPayload { 
    ownerId: string; 
    name: string; 
    description: string; 
    status: number; 
    imgUrl: string; 
    workingDays: string; 
}

// --- Embedded authService Logic (Chỉ cần getUserIdFromTokenPayload) ---

// Hàm giải mã base64URL
const base64UrlDecode = (base64Url: string): string => {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    try {
        return decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch {
        return "{}";
    }
}

// Hàm giải mã token payload
const decodeTokenPayload = (token: string): TokenPayload => {
    try {
        const base64Url = token.split('.')[1];
        const jsonPayload = base64UrlDecode(base64Url);
        
        const payload = JSON.parse(jsonPayload);
        
        if (!Array.isArray(payload.roles)) {
            payload.roles = [payload.roles]; 
        }

        return payload as TokenPayload;
    } catch (e) {
        console.error("Failed to decode token:", e);
        return { sub: "", role: ['ROLE_USER'], exp: 0, userId: "" }; 
    }
};

// Hàm trích xuất User ID (Dùng 'sub' như đã thống nhất)
const getUserIdFromTokenPayload = (token: string): string => {
    const payload = decodeTokenPayload(token);
    return payload.userId || ''; 
};


// --- Embedded shopService Logic (Chỉ cần createShop) ---

const SHOP_API_URL = 'https://shop.devnest.io.vn/api/shop'; // Sử dụng URL cố định

const shopService = {
    createShop: async (payload: ShopCreationPayload): Promise<any> => {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await axios.post(SHOP_API_URL, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            // Giả định response.data.data chứa kết quả
            return response.data.data; 
        } catch (error) {
             // Re-throw để hàm gọi bên ngoài xử lý lỗi
            throw error;
        }
    },
};


// --- Component Code ---

// Định nghĩa kiểu dữ liệu cho Form
type ShopOnboardingInputs = {
    name: string;
    description: string;
    imgUrl: string; 
    workingDays: string; // Đã sửa kiểu dữ liệu này thành chuỗi định dạng thời gian làm việc
};

// ĐÃ CẬP NHẬT: Giá trị mặc định phải khớp với định dạng API yêu cầu (ví dụ: Mon-Fri 08:00-17:00)
const defaultWorkingDays = 'Mon-Fri 08:00-17:00; Sat 09:00-12:00'; 

export default function StoreOnboardingPage() {
    // const { t } = useTranslation(); // Đã thay thế bằng hàm t() local
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true); 
    const [userId, setUserId] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ShopOnboardingInputs>({
        defaultValues: {
            name: '',
            description: '',
            imgUrl: 'https://placehold.co/400x200/4A3837/E8D1A3?text=Shop+Image', 
            workingDays: defaultWorkingDays,
        },
        mode: 'onBlur',
    });

    // Lấy userId ngay khi component được mount và kiểm tra token
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const id = getUserIdFromTokenPayload(token);
            if (id) {
                setUserId(id);
            } else {
                message.error(t("Token không hợp lệ hoặc thiếu ID người dùng. Vui lòng đăng nhập lại."));
                router.push('/login');
            }
        } else {
            message.error(t("Vui lòng đăng nhập để tiếp tục."));
            router.push('/login');
        }
        setPageLoading(false); 
    }, [router]); 

    // Xử lý logic tạo cửa hàng
    const onSubmit: SubmitHandler<ShopOnboardingInputs> = async (data) => {
        if (!userId) {
            message.error(t("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại."));
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            const payload: ShopCreationPayload = {
                ownerId: userId, 
                name: data.name,
                description: data.description,
                status: 1, 
                imgUrl: data.imgUrl,
                workingDays: data.workingDays, // Giờ là chuỗi định dạng đúng
            };
            
            await shopService.createShop(payload);

            message.success(t("Tạo cửa hàng thành công! Đang chuyển hướng đến trang quản lý."));
            router.push('/store'); 

        } catch (error: any) {
            console.error("Shop Creation Error:", error.response?.data || error.message);
            const apiErrorMessage = error.response?.data?.error?.errors?.[0]; // Lấy lỗi chi tiết từ API
            const errorMessage = apiErrorMessage || error.response?.data?.message || t("Lỗi khi tạo cửa hàng. Vui lòng kiểm tra lại thông tin.");
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading || !userId) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Card className="shadow-2xl p-8 text-center">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    <h1 className="text-xl font-bold text-gray-700 mt-4">
                        {t("Đang tải và xác thực người dùng...")}
                    </h1>
                </Card>
            </div>
        );
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-[#E7F3F5] p-6">
            <Card 
                title={<h2 className="text-2xl font-bold text-center text-[#4A3837]">{t("Tạo Cửa Hàng Mới")}</h2>} 
                className="w-full max-w-xl shadow-2xl rounded-xl border-t-4 border-[#8B6E5A]"
            >
                <div className="text-center mb-6 text-gray-600">
                    <p>{t("Chào mừng! Vui lòng cung cấp thông tin cơ bản để bắt đầu quản lý dịch vụ.")}</p>
                </div>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    
                    {/* Input Tên cửa hàng */}
                    <Form.Item 
                        label={t("Tên cửa hàng")} 
                        required 
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name?.message && t(errors.name.message)}
                    >
                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: t("Tên cửa hàng là bắt buộc") }}
                            render={({ field }) => (
                                <Input {...field} placeholder={t("Ví dụ: PetCare VIP")} size="large" />
                            )}
                        />
                    </Form.Item>

                    {/* Input Mô tả */}
                    <Form.Item 
                        label={t("Mô tả ngắn")}
                        required
                        validateStatus={errors.description ? 'error' : ''}
                        help={errors.description?.message && t(errors.description.message)}
                    >
                        <Controller
                            control={control}
                            name="description"
                            rules={{ 
                                required: t("Mô tả là bắt buộc"),
                                maxLength: { value: 200, message: t("Mô tả không quá 200 ký tự") }
                            }}
                            render={({ field }) => (
                                <Input.TextArea 
                                    {...field} 
                                    placeholder={t("Cung cấp dịch vụ chăm sóc thú cưng cao cấp...")} 
                                    rows={3} 
                                    size="large"
                                />
                            )}
                        />
                    </Form.Item>
                    
                    {/* Input URL Ảnh đại diện */}
                    <Form.Item label={t("URL Ảnh đại diện (Tùy chọn)")}>
                        <Controller
                            control={control}
                            name="imgUrl"
                            render={({ field }) => (
                                <Input {...field} placeholder={t("URL ảnh cửa hàng...")} size="large" />
                            )}
                        />
                    </Form.Item>

                    {/* Input Ngày làm việc (ĐÃ SỬA: Giờ là input bình thường) */}
                    <Form.Item label={t("Thời gian làm việc")} 
                        required
                        validateStatus={errors.workingDays ? 'error' : ''}
                        help={t("Định dạng: Mon-Fri 08:00-17:00; Sat 09:00-12:00")}
                    >
                        <Controller
                            control={control}
                            name="workingDays"
                            rules={{ required: t("Thời gian làm việc là bắt buộc") }}
                            render={({ field }) => (
                                <Input 
                                    {...field} 
                                    placeholder={t("Ví dụ: Mon-Fri 08:00-17:00")} 
                                    size="large"
                                />
                            )}
                        />
                    </Form.Item>
                    

                    {/* Hiển thị Owner ID để debug/kiểm tra */}
                    <div className="text-sm text-gray-400 mb-4 text-center">
                        Owner ID (Giải mã từ Token): {userId.substring(0, 8)}...
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="w-full !bg-[#2a9d8f] !border-none hover:!bg-[#207f73] transition-all duration-300 !text-white font-bold"
                        loading={loading}
                    >
                        {t("Tạo Cửa Hàng và Bắt Đầu")}
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
