"use client";

import React from "react";

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 min-h-screen">
      {/* Left side - Form */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Banner */}
      <div className="flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center text-center p-8">
          <img src="/images/banner.png" alt="Logo" className="w-40 h-40 mb-4" />
          <h2 className="text-2xl font-bold">CARE NEST</h2>
          <p className="text-gray-600 mt-2">
            Kết nối dịch vụ, nâng tầm chăm sóc thú cưng.
          </p>
        </div>
      </div>
    </div>
  );
}
