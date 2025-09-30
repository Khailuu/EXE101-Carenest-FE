"use client";

import React, { useState, useEffect } from "react";
import Step1Email from "./Step1Email";
import Step2OTP from "./Step2OTP";
import Step3ResetPassword from "./Step3ResetPassword";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendEmail = (emailInput: string) => {
    setEmail(emailInput);
    toast.success(t("forgotPassword.sendOtp"));
    setStep(2);
    setCountdown(60);
  };

  const handleVerifyOtp = (otpInput: string) => {
    setOtp(otpInput);
    toast.success(t("forgotPassword.otpVerified"));
    setStep(3);
  };

  const handleResendOtp = () => {
    if (countdown === 0) {
      toast.success(t("forgotPassword.otpResent"));
      setCountdown(60);
    }
  };

  const handleResetPassword = (password: string) => {
    console.log("Reset password for", email, "with", password);
    toast.success(t("forgotPassword.resetSuccess"));
    router.push("/login");
  };

  return (
    <>
      {step === 1 && <Step1Email onNext={handleSendEmail} />}
      {step === 2 && (
        <Step2OTP
          onNext={handleVerifyOtp}
          onResend={handleResendOtp}
          countdown={countdown}
        />
      )}
      {step === 3 && <Step3ResetPassword onSubmit={handleResetPassword} />}
    </>
  );
}
