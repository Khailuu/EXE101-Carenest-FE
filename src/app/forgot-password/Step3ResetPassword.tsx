"use client";
import { Formik, Form, Field } from "formik";
import { Input, Button } from "antd";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const schema = Yup.object({
  password: Yup.string().min(6).required("required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "notMatch")
    .required("required")
});

export default function Step3ResetPassword({ onSubmit }: { onSubmit: (password: string) => void }) {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={schema}
      onSubmit={(values) => onSubmit(values.password)}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-3 bg-white p-6 rounded-xl shadow-md w-[350px]">
          <h2 className="text-lg font-bold text-center">{t("forgotPassword.resetTitle")}</h2>
          <p className="text-sm text-gray-500 text-center">{t("forgotPassword.resetDesc")}</p>

          <label className="font-medium">{t("common.password")}</label>
          <Field as={Input.Password} name="password" placeholder={t("common.password")} />
          {touched.password && errors.password && <div className="text-red-500">{t("forgotPassword.invalidPassword")}</div>}

          <label className="font-medium">{t("common.confirmPassword")}</label>
          <Field as={Input.Password} name="confirmPassword" placeholder={t("common.confirmPassword")} />
          {touched.confirmPassword && errors.confirmPassword && (
            <div className="text-red-500">{t("forgotPassword.passwordNotMatch")}</div>
          )}

          <Button type="primary" htmlType="submit" block>
            {t("common.confirm")}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
