"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="w-full grid grid-cols-2 h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1>{t("Register")}</h1>

        <button
          onClick={() => router.push("/register/store-register")}
          className="px-6 py-2 mt-4 bg-orange-400 text-white rounded hover:bg-orange-500"
        >
          {t("Register")}
        </button>

        <span
          className="mt-4 text-orange-400 underline hover:!text-orange-600 cursor-pointer"
          id="register-button"
          onClick={() => router.push("/login")}
        >
          {t("Login")}
        </span>
      </div>
      <div className="flex justify-center items-center bg-[#E7F3F5]">
        <img src="/images/banner.png" alt="banner" />
      </div>
    </div>
  );
}
