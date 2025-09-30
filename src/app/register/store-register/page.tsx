"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Steps } from "antd";
import Step1OwnerInfo from "./Step1OwnerInfo";
import Step2CCCD from "./Step2CCCD";
import Step3StoreInfo from "./Step3StoreInfo";
import type { OwnerInfo, CCCDInfo, StoreInfo } from "./types";

export default function Page() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  // Gom dữ liệu qua từng bước
  const [formData, setFormData] = useState<{
    owner?: OwnerInfo;
    cccd?: CCCDInfo;
    store?: StoreInfo;
  }>({});

  // Wrapper cho từng step để đảm bảo type khớp
  const handleNextOwner = (data: { owner: OwnerInfo }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleNextCCCD = (data: { cccd: CCCDInfo }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className="w-full grid grid-cols-2 h-screen">
      {/* Cột trái: form giống layout login */}
      <div className="flex flex-col justify-center items-center">
        <h1>{t("Register Store")}</h1>

        <div className="border border-gray-300 rounded-lg p-6">
          <Steps
            current={step - 1}
            items={[
              { title: t("Account Info") },      // Step 1
              { title: t("Verify Identity") },    // Step 2 (CCCD)
              { title: t("Store Info") },         // Step 3
            ]}
            className="mb-6"
          />

          {step === 1 && (
            <Step1OwnerInfo onNext={handleNextOwner} />
          )}

          {step === 2 && (
            <Step2CCCD onNext={handleNextCCCD} onPrev={handlePrev} />
          )}

          {step === 3 && (
            <Step3StoreInfo data={formData} onPrev={handlePrev} />
          )}
        </div>
      </div>

      {/* Cột phải: banner giống login */}
      <div className="flex justify-center items-center bg-[#E7F3F5]">
        <img src="/images/banner.png" alt="banner" />
      </div>
    </div>
  );
}
