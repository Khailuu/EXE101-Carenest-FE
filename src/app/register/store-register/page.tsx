// src/app/store/register/Page.tsx
"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Steps, message } from "antd";
import Step1OwnerInfo from "./Step1OwnerInfo";
import Step2VerifyEmail from "./Step2VerifyEmail";
import { OwnerInfo, VerificationData, OwnerRegistrationPayload } from "./types";
import { authService } from "@/services/authService"; // Import Service
// import { useRouter } from 'next/navigation'; // Uncomment nếu bạn dùng Next.js Router

export default function Page() {
  const { t } = useTranslation();
  // const router = useRouter(); // Uncomment nếu bạn dùng Next.js Router
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading cho API Step 1
  
  // STATE ĐỂ LƯU TRỮ X-KEY-APT (quan trọng cho Bước 2)
  const [xKeyAPT, setXKeyAPT] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    owner?: OwnerInfo;
    verification?: VerificationData;
  }>({});
  
  /**
   * Wrapper cho Step 1: Gọi API đăng ký, nhận X-Key-APT và chuyển bước.
   */
  const handleNextOwner = async (data: { owner: OwnerInfo }) => {
    setLoading(true);
    
    // Tạo payload hoàn chỉnh cho API đăng ký 
    const payload: OwnerRegistrationPayload = {
      ...data.owner,
      reEnterPassword: (data.owner as any).reEnterPassword || data.owner.password, 
    };

    try {
        // GỌI SERVICE: Gọi authService.registerOwner
        const key = await authService.registerOwner(payload); 
        
        // --- CẬP NHẬT STATE VÀ CHUYỂN BƯỚC THÀNH CÔNG ---
        
        // 1. Lưu dữ liệu form 
        setFormData((prev) => ({ ...prev, owner: data.owner }));
        
        // 2. Lưu X-Key-APT
        setXKeyAPT(key);
            
        // 3. Chuyển sang Bước 2
        setStep(prev => prev + 1);
        
        message.success(t(`Registration successful. Verification code sent to ${data.owner.email}`));

    } catch (error: any) {
        console.error("Registration Error:", error.message, error.response?.data);
        message.error(t(error.response?.data?.message || error.message || "Registration failed. Please check your data and try again."));
    } finally {
        setLoading(false);
    }
  };

  /**
   * Xử lý sau khi Step 2 (Xác minh) hoàn tất thành công.
   */
  const handleNextVerify = (data: VerificationData) => {
    setFormData((prev) => ({ ...prev, verification: data }));
    
    message.success(t("Successfully registered and verified. Redirecting..."));
    // Thêm logic chuyển hướng cuối cùng ở đây
    // router.push('/login');
    
    // Đặt lại state sau khi hoàn tất
    setStep(1);
    setFormData({});
    setXKeyAPT(null);
  };

  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className="w-full grid grid-cols-2 h-screen">
      {/* Cột trái: form */}
      <div className="flex flex-col justify-center items-center">
        <h1>{t("Register Store")}</h1>

        <div className="border border-gray-300 rounded-lg p-6">
          <Steps
            current={step - 1}
            items={[
              { title: t("Account Info") },      // Step 1
              { title: t("Verify Email") },       // Step 2
            ]}
            className="mb-6"
          />

          {step === 1 && (
            // Giả định Step1OwnerInfo nhận prop isSubmitting
            <Step1OwnerInfo onNext={handleNextOwner} isSubmitting={loading} />
          )}

          {step === 2 && (
            <Step2VerifyEmail 
              email={formData.owner?.email || ''} 
              xKeyAPT={xKeyAPT} // Truyền X-Key-APT
              onNext={handleNextVerify} 
              onPrev={handlePrev} 
            />
          )}
        </div>
      </div>

      {/* Cột phải: banner */}
      <div className="flex justify-center items-center bg-[#E7F3F5]">
        <img src="/images/banner.png" alt="banner" />
      </div>
    </div>
  );
}
