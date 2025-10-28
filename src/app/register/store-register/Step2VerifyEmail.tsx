// src/app/store/register/Step2VerifyEmail.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Input, Button, message } from "antd";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { VerificationData } from "./types";
import { authService } from "@/services/authService"; // Sử dụng authService

interface Step2VerifyEmailProps {
  email: string; // Email đã nhập từ Bước 1
  xKeyAPT: string | null; // X-Key-APT từ Bước 1
  onNext: (data: VerificationData) => void; 
  onPrev: () => void;
}

const schema = Yup.object({
  verificationCode: Yup.string()
    .required("Vui lòng nhập mã xác minh")
    .matches(/^\d{6}$/, "Mã xác minh phải là 6 chữ số"),
});

export default function Step2VerifyEmail({
  email,
  xKeyAPT,
  onNext,
  onPrev,
}: Step2VerifyEmailProps) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(60); 
  const [isSending, setIsSending] = useState(false); 
  const [isVerifying, setIsVerifying] = useState(false); // Loading riêng cho nút submit

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Hàm gửi lại mã OTP sử dụng authService
  const handleResendCode = async () => {
    if (!xKeyAPT) {
      message.error(t("Missing session key. Please go back to step 1."));
      return;
    }
    setIsSending(true);
    
    try {
        // GỌI SERVICE: authService.resendOtp
        await authService.resendOtp(email, xKeyAPT);
        message.success(t("Verification code resent successfully!"));
        setCountdown(60);
    } catch (error: any) {
        message.error(t(error.response?.data?.message || "Failed to resend code."));
    } finally {
        setIsSending(false);
    }
  };

  const handleSubmit = async (
    values: VerificationData,
    actions: FormikHelpers<VerificationData>
  ) => {
    if (!xKeyAPT) {
        message.error(t("Missing session key. Please go back to step 1."));
        return;
    }
    
    setIsVerifying(true);
    
    try {
        // GỌI SERVICE: authService.verifyEmail
        await authService.verifyEmail(
            email, 
            values.verificationCode, 
            xKeyAPT
        );
        
        message.success(t("Email verification successful! Registration complete."));
        onNext(values); // Cập nhật state và kích hoạt chuyển hướng/logic cuối ở Page.tsx
        
    } catch (error: any) {
        console.error("Verification API Error:", error.response?.data || error.message);
        message.error(t(error.response?.data?.message || "Verification failed. Check your code or try again."));
    } finally {
        setIsVerifying(false);
        actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ verificationCode: "" }}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-5 w-96">
          <p className="text-gray-600">
            {t("We have sent a 6-digit verification code to the email:")}{" "}
            <span className="font-semibold text-teal-600">{email}</span>
          </p>
          
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="verificationCode">
              {t("Verification Code")}
            </label>
            <Field name="verificationCode">
              {({ field }: any) => (
                <Input
                  {...field}
                  id="verificationCode"
                  placeholder="Nhập 6 chữ số"
                  maxLength={6}
                />
              )}
            </Field>
            {touched.verificationCode && errors.verificationCode && (
              <div className="text-red-500 text-sm">
                {errors.verificationCode}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-sm">
            {countdown > 0 ? (
              <span className="text-gray-500">
                {t("Resend code in")} ({countdown}s)
              </span>
            ) : (
              <Button
                type="link"
                onClick={handleResendCode}
                loading={isSending}
                disabled={isSending}
                className="p-0 h-auto"
              >
                {t("Resend Code")}
              </Button>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={onPrev}>{t("Back")}</Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isVerifying} 
            >
              {t("Complete Registration")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
