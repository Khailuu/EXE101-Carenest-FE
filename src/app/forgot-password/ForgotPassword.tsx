"use client";
import { useState, useEffect } from "react";
import Step1Email from "./Step1Email";
import Step2OTP from "./Step2OTP";
import Step3ResetPassword from "./Step3ResetPassword";
import { sendOtp, verifyOtp, resetPassword } from "./service";

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(60);

  // Countdown cho resend OTP
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  // B1: Nhập email
  const handleEmailSubmit = async (email: string) => {
    await sendOtp(email);
    setEmail(email);
    setCountdown(60);
    setStep(2);
  };

  // B2: Nhập OTP
  const handleOtpSubmit = async (otp: string) => {
    const success = await verifyOtp(email, otp);
    if (success) {
      setStep(3);
    } else {
      alert("OTP không đúng");
    }
  };

  const handleResendOtp = async () => {
    await sendOtp(email);
    setCountdown(60);
  };

  // B3: Đổi mật khẩu
  const handleResetPassword = async (password: string) => {
    await resetPassword(email, password);
    alert("Đổi mật khẩu thành công!");
    setStep(1);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {step === 1 && <Step1Email onNext={handleEmailSubmit} />}
      {step === 2 && (
        <Step2OTP onNext={handleOtpSubmit} onResend={handleResendOtp} countdown={countdown} />
      )}
      {step === 3 && <Step3ResetPassword onSubmit={handleResetPassword} />}
    </div>
  );
}
