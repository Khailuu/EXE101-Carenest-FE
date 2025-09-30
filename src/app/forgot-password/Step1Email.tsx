"use client";
import { Formik, Form, Field } from "formik";
import { Input, Button } from "antd";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

export default function Step1Email({ onNext }: { onNext: (email: string) => void }) {
  const { t } = useTranslation(["forgotPassword", "common"]);

  const schema = Yup.object({
    email: Yup.string()
      .email(t("forgotPassword:invalidEmail")) // lỗi email sai định dạng
      .required(t("forgotPassword:requiredEmail")), // lỗi thiếu email
  });

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={schema}
      onSubmit={(values) => onNext(values.email)}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-3 bg-white p-6 rounded-xl shadow-md w-[350px]">
          <h2 className="text-lg font-bold text-center">{t("forgotPassword:title")}</h2>
          <p className="text-sm text-gray-500 text-center">{t("forgotPassword:enterEmail")}</p>

          <label className="font-medium">{t("common:email")}</label>
          <Field as={Input} name="email" placeholder={t("common:email")} />
          {touched.email && errors.email && (
            <div className="text-red-500">{errors.email}</div>
          )}

          <Button type="primary" htmlType="submit" block>
            {t("forgotPassword:sendOtp")}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
