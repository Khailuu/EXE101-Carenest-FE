"use client";
import { Formik, Form, Field } from "formik";
import { Input, Button } from "antd";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const schema = Yup.object({
  otp: Yup.string().length(6).required("required")
});

export default function Step2OTP({
  onNext,
  onResend,
  countdown
}: {
  onNext: (otp: string) => void;
  onResend: () => void;
  countdown: number;
}) {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{ otp: "" }}
      validationSchema={schema}
      onSubmit={(values) => onNext(values.otp)}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-3 bg-white p-6 rounded-xl shadow-md w-[350px]">
          <h2 className="text-lg font-bold text-center">{t("forgotPassword.title")}</h2>
          <p className="text-sm text-gray-500 text-center">{t("forgotPassword.enterOtp")}</p>

          <label className="font-medium">{t("forgotPassword.otp")}</label>
          <Field as={Input} name="otp" maxLength={6} placeholder="******" />
          {touched.otp && errors.otp && <div className="text-red-500">{t("forgotPassword.invalidOtp")}</div>}

          <Button type="primary" htmlType="submit" block>
            {t("common.confirm")}
          </Button>

          <button
            type="button"
            onClick={onResend}
            disabled={countdown > 0}
            className="text-sm text-gray-500 hover:text-blue-500 mt-2"
          >
            {countdown > 0
              ? `${t("forgotPassword.resendIn")} (${countdown}s)`
              : t("forgotPassword.resend")}
          </button>
        </Form>
      )}
    </Formik>
  );
}
