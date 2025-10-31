"use client";

import React, { useState } from "react";
// Đảm bảo bạn đã cài đặt và cấu hình react-i18next
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
// Sử dụng các component UI của Ant Design
import { Input, Button, Checkbox, Modal, message } from "antd"; 
import type { CheckboxProps } from "antd";
import { useRouter } from "next/navigation";
import { authService, decodeTokenPayload, getUserIdFromTokenPayload } from "@/services/authService"; 
import { shopService } from "../services/shopService"; 
// Thay thế bằng đường dẫn thực tế của type LoginPayload
import { LoginPayload } from "@/app/register/store-register/types"; 

type Inputs = {
  username: string; 
  password: string;
};

// --- HÀM CHUYỂN HƯỚNG DỰA TRÊN ROLE VÀ SHOP STATUS ---
const handleRoleRedirect = async (token: string, router: any, t: (key: string) => string) => {
  const tokenPayload = decodeTokenPayload(token);
  const role = tokenPayload.role || []; // Đảm bảo luôn là mảng
  console.log(role)
  const userId = getUserIdFromTokenPayload(token);

  if (role.includes("ROLE_ADMIN")) {
    message.success(t("Đăng nhập thành công! Chuyển hướng đến Admin Dashboard."));
    router.push("/admin/dashboard");
    return;
  } 
  
  if (role.includes("ROLE_SHOP")) {
    // Nếu không có userId, không thể kiểm tra cửa hàng
    if (!userId) {
        message.error(t("Không thể xác định ID người dùng. Vui lòng đăng nhập lại."));
        return;
    }
    
    try {
      // 1. Lấy danh sách cửa hàng
      const shopResponse = await shopService.getShops();
      // 2. Kiểm tra xem có cửa hàng nào thuộc sở hữu của userId hiện tại không
      const hasShop = shopResponse.items.some((shop) => {
        console.log(userId)
        console.log(shop.ownerId)
        return shop.ownerId === userId
      });
      console.log(hasShop)

      if (hasShop) {
        message.success(t("Đăng nhập thành công! Chuyển hướng đến trang cửa hàng."));
        router.push("/store");
      } else {
        // Chuyển hướng đến trang tạo thông tin cửa hàng
        message.warning(t("Vui lòng tạo thông tin cửa hàng để tiếp tục sử dụng dịch vụ."));
        router.push("/store/onboarding");
      }
    } catch (apiError) {
      console.error("Failed to check shop existence:", apiError);
      // Giả định nếu lỗi API thì cũng nên chuyển hướng đến Onboarding để thử tạo
      message.error(t("Lỗi khi kiểm tra thông tin cửa hàng. Chuyển hướng đến trang tạo cửa hàng."));
      router.push("/store/onboarding");
    }
    return;
  } 
  
  if (role.includes("ROLE_USER")) {
    message.error(t("Tài khoản này không có quyền truy cập vào giao diện quản lý."));
    return;
  }
  
  message.error(t("Không xác định được quyền truy cập. Vui lòng liên hệ hỗ trợ."));
};
// --------------------------------------

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  });

  // --- LOGIC SUBMIT ĐÃ CẬP NHẬT ĐỂ GỌI API ---
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    
    try {
      const payload: LoginPayload = {
        username: data.username,
        password: data.password,
      };
      
      // 1. Gọi API Đăng nhập và nhận token
      const token = await authService.login(payload);
      console.log("Login Successful, Token:", token);
      
      // 2. Lưu token
      localStorage.setItem("authToken", token); 

      // 3. Chuyển hướng dựa trên Role và Shop Status
      await handleRoleRedirect(token, router, t);

    } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || t("Tài khoản hoặc mật khẩu không chính xác!");
      message.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };
  // ---------------------------------------------

  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <div className="w-full grid grid-cols-2 h-screen relative">
      {/* Modal Quên mật khẩu */}
      <Modal
        title={<div className="text-center">{t("Quên mật khẩu")}</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        maskClosable={true}
        centered
      >
        <div className="flex flex-col items-center">
          <p className="text-center">
            {t("Vui lòng nhập email của bạn để đặt lại mật khẩu.")}
          </p>
          <Input placeholder={t("Nhập email của bạn")} className="!my-4 w-full" />
          <Button
            className="!bg-[#2a9d8f] !text-white !w-full hover:!text-black transition-all duration-300"
            onClick={() => {
              message.success(t("Link đặt lại đã được gửi!"));
              setIsModalOpen(false);
            }}
          >
            {t("Gửi Link Đặt Lại")}
          </Button>
        </div>
      </Modal>

      <div className="flex flex-col justify-center items-center">
        <h1>{t("Đăng nhập")}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border flex flex-col justify-center items-center border-gray-300 rounded-lg p-6 w-96"
        >
          {/* Controller cho Tên đăng nhập */}
          <Controller
            control={control}
            name="username"
            rules={{
              required: t("Tên đăng nhập không được để trống"),
            }}
            render={({ field }) => (
              <Input {...field} placeholder={t("Tên đăng nhập (Username)")} size="large" />
            )}
          />
           <div className="h-4 w-full">
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div> 

          {/* Controller cho Mật khẩu */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: t("Mật khẩu không được để trống"),
              minLength: {
                value: 6,
                message: t("Mật khẩu phải có ít nhất 6 ký tự"),
              },
            }}
            render={({ field }) => (
              <Input.Password {...field} placeholder={t("Mật khẩu")} size="large" />
            )}
          />
          <div className="h-4 w-full">
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-between items-center w-full mt-3">
            <Checkbox onChange={onChange}>{t("Ghi nhớ đăng nhập")}</Checkbox>
            <p
              className="underline cursor-pointer text-gray-500 hover:text-black transition-all duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              {t("Quên mật khẩu?")}
            </p>
          </div>

          <Button
            htmlType="submit"
            style={{
              backgroundColor: "#2a9d8f", 
              border: "none",
              marginTop: "20px",
              marginBottom: "10px",
            }}
            size="large"
            className="!text-white w-full hover:!bg-[#207f73] transition-all duration-300"
            loading={loading}
          >
            {t("Đăng nhập")}
          </Button>

          <p className="text-[16px]">
            {t("Chưa có tài khoản?")}{" "}
            <span
              className="text-orange-400 underline hover:!text-orange-600 cursor-pointer"
              onClick={() => router.push("/register/store-register")}
            >
              {t("Đăng ký")}
            </span>
          </p>
        </form>
      </div>

      <div className="flex justify-center items-center bg-[#E7F3F5]">
        <img src="/images/banner.png" alt="banner" />
      </div>
    </div>
  );
}
