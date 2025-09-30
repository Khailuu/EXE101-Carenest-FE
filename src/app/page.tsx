"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input, Button, Checkbox, Modal } from "antd";
import type { CheckboxProps } from "antd";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài đặt react-toastify

type Inputs = {
  email: string;
  password: string;
};

// --- MOCK DATA TÀI KHOẢN ---
const mockAccounts = [
  {
    email: "customer@example.com",
    password: "123456",
    role: "customer",
    redirectPath: "/",
  },
  {
    email: "admin@example.com",
    password: "123456",
    role: "admin",
    redirectPath: "/admin/dashboard",
  },
  {
    email: "store@example.com",
    password: "123456",
    role: "store",
    redirectPath: "/store",
  },
];
// ----------------------------

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
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // --- LOGIC SUBMIT ĐÃ CẬP NHẬT ---
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    // Mô phỏng quá trình API call
    setTimeout(() => {
      const user = mockAccounts.find(
        (account) =>
          account.email === data.email && account.password === data.password
      );

      if (user) {
        toast.success(t(`Đăng nhập thành công!`));
        router.push(user.redirectPath);
      } else {
        toast.error(t("Email hoặc mật khẩu không chính xác!"));
      }
      setLoading(false);
    }, 1000); // Giả lập độ trễ 1 giây
  };
  // ---------------------------------

  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <div className="w-full grid grid-cols-2 h-screen relative">
      {/* Forgot Password Modal */}
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
              toast.success(t("Link đặt lại đã được gửi!"));
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
          {/* Email Controller */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: t("Email không được để trống"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: t("Email không hợp lệ"),
              },
            }}
            render={({ field }) => (
              <Input {...field} placeholder={t("Email")} size="large" />
            )}
          />
          <div className="h-4 w-full">
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Controller */}
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
              onClick={() => setIsModalOpen(true)} // Mở modal thay vì chuyển trang
            >
              {t("Quên mật khẩu?")}
            </p>
          </div>

          <Button
            htmlType="submit"
            style={{
              backgroundColor: "#2a9d8f", // Màu xanh mint
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
        {/* Màu nền #E7F3F5 là màu xanh nhạt pastel */}
        <img src="/images/banner.png" alt="banner" />
      </div>
    </div>
  );
}