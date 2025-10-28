"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { setUserId, setShopId } from '@/redux/userSlice';
import { Input, Button, Checkbox, Modal, message } from "antd";
import type { CheckboxProps } from "antd";
import { useRouter } from "next/navigation";
import { authService, decodeTokenPayload } from "@/services/authService";
import { shopService } from '@/services/shopService';
import { LoginPayload } from "@/app/register/store-register/types";

type Inputs = {
  username: string;
  password: string;
};

const handleRoleRedirect = async (roles: string[], router: any, t: (key: string) => string, userId: string, dispatch: any) => {
  if (roles.includes("ROLE_ADMIN")) {
    message.success(t("Đăng nhập thành công! Chuyển hướng đến Admin Dashboard."));
    router.push("/admin/dashboard");
  } else if (roles.includes("ROLE_SHOP")) {
    const shopId = await shopService.checkIfUserOwnsShop(userId);
    if (shopId) {
      dispatch(setShopId(shopId));
      message.success(t("Đăng nhập thành công! Chuyển hướng đến trang cửa hàng."));
      router.push("/store");
    } else {
      dispatch(setShopId(null));
      message.warning(t("Bạn chưa có cửa hàng nào. Vui lòng tạo cửa hàng mới."));
      router.push("/store/onboarding");
    }
  } else if (roles.includes("ROLE_USER")) {
    message.error(t("Tài khoản này không có quyền truy cập vào giao diện quản lý."));
  } else {
    message.error(t("Không xác định được quyền truy cập. Vui lòng liên hệ hỗ trợ."));
  }
};

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    
    try {
      const payload: LoginPayload = {
        username: data.username,
        password: data.password,
      };
      
      const token = await authService.login(payload);

      localStorage.setItem("authToken", token); 

      const tokenPayload = decodeTokenPayload(token);

      dispatch(setUserId(tokenPayload.userId));
      
      handleRoleRedirect(tokenPayload.role, router, t, tokenPayload.userId, dispatch);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t("Tài khoản hoặc mật khẩu không chính xác!");
      message.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  const onChange: CheckboxProps["onChange"] = (e) => {
  };

  return (
    <div className="w-full grid grid-cols-2 h-screen relative">
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
