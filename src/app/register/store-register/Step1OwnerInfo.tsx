"use client";
import { Formik, Form, Field } from "formik";
import { Input, Button, DatePicker, Select } from "antd";
import * as Yup from "yup";
import dayjs from "dayjs";
import { OwnerInfo } from "./types";
import { useTranslation } from "react-i18next";

export default function Step1OwnerInfo({
  onNext,
}: {
  onNext: (data: { owner: OwnerInfo }) => void;
}) {
  const { t } = useTranslation();

  const schema = Yup.object({
    username: Yup.string().required(t("Please enter username")),
    fullName: Yup.string().required(t("Please enter full name")),
    email: Yup.string().email(t("Invalid email")).required(t("Please enter email")),
    birthDate: Yup.string().required(t("Please select birth date")),
    gender: Yup.string().required(t("Please select gender")),
    password: Yup.string().min(6, t("Minimum 6 characters")).required(t("Please enter password")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("Passwords do not match"))
      .required(t("Please confirm password")),
  });

  return (
    <Formik
      initialValues={{
        username: "",
        fullName: "",
        email: "",
        birthDate: "",
        gender: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={schema}
      onSubmit={(values) => {
        const { confirmPassword, ...ownerInfo } = values;
        onNext({ owner: ownerInfo });
      }}
    >
      {({ setFieldValue, errors, touched, values }) => (
        <Form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 mt-[8px]">
            <label htmlFor="username" className="font-medium mb-[4px]">{t("Username")}</label>
            <Field as={Input} id="username" name="username" placeholder={t("Enter username")} />
            {touched.username && errors.username && <div className="text-red-500">{errors.username}</div>}
          </div>

          <div className="flex flex-col gap-1 mt-[8px]">
            <label htmlFor="fullName" className="font-medium mb-[4px]">{t("Full Name")}</label>
            <Field as={Input} id="fullName" name="fullName" placeholder={t("Enter full name")} />
            {touched.fullName && errors.fullName && <div className="text-red-500">{errors.fullName}</div>}
          </div>

          <div className="flex flex-col gap-1 mt-[8px]">
            <label htmlFor="email" className="font-medium mb-[4px]">{t("Email")}</label>
            <Field as={Input} id="email" name="email" placeholder={t("Enter email")} />
            {touched.email && errors.email && <div className="text-red-500">{errors.email}</div>}
          </div>

          <div className="flex flex-col gap-1 mt-[8px]">
            <label htmlFor="birthDate" className="font-medium mb-[4px]">{t("Birth Date")}</label>
            <DatePicker
              id="birthDate"
              style={{ width: "100%" }}
              value={values.birthDate ? dayjs(values.birthDate) : null}
              onChange={(date) => setFieldValue("birthDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
              placeholder={t("Select birth date")}
            />
            {touched.birthDate && errors.birthDate && <div className="text-red-500">{errors.birthDate}</div>}
          </div>

          <div className="flex flex-col gap-1 mt-[8px]">
            <label htmlFor="gender" className="font-medium mb-[4px]">{t("Gender")}</label>
            <Select
              id="gender"
              style={{ width: "100%" }}
              placeholder={t("Select gender")}
              value={values.gender || undefined}
              onChange={(value) => setFieldValue("gender", value)}
              options={[
                { label: t("Male"), value: "male" },
                { label: t("Female"), value: "female" },
                { label: t("Other"), value: "other" },
              ]}
            />
            {touched.gender && errors.gender && <div className="text-red-500">{errors.gender}</div>}
          </div>

          <div className="flex flex-col gap-1 mt-[8px]">
            <label htmlFor="password" className="font-medium mb-[4px]">{t("Password")}</label>
            <Field as={Input.Password} id="password" name="password" placeholder={t("Enter password")} />
            {touched.password && errors.password && <div className="text-red-500">{errors.password}</div>}
          </div>

          <div className="flex flex-col gap-1 mt-[8px]">
            <label htmlFor="confirmPassword" className="font-medium mb-[4px]">{t("Confirm Password")}</label>
            <Field as={Input.Password} id="confirmPassword" name="confirmPassword" placeholder={t("Re-enter password")} />
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="text-red-500">{errors.confirmPassword}</div>
            )}
          </div>

          <Button type="primary" className="!mt-[10px]" htmlType="submit" block>
            {t("Next")}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
