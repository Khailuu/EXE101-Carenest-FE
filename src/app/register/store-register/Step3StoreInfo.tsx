"use client";
import { Formik, Form, Field } from "formik";
import { Input, Button, Upload } from "antd";
import * as Yup from "yup";
import { registerStore } from "./service";
import { StoreInfo, OwnerInfo, CCCDInfo } from "./types";

const schema = Yup.object({
  storeName: Yup.string().required("Vui lòng nhập tên cửa hàng"),
  description: Yup.string().required("Vui lòng nhập mô tả"),
});

export default function Step3StoreInfo({
  data,
  onPrev,
}: {
  data: { owner?: OwnerInfo; cccd?: CCCDInfo; store?: StoreInfo };
  onPrev: () => void;
}) {
  return (
    <Formik
      initialValues={{ storeName: "", description: "", avatar: null }}
      validationSchema={schema}
      onSubmit={async (values) => {
        const formData = new FormData();
        formData.append("owner", JSON.stringify(data.owner));
        if (data.cccd?.cccdFront) formData.append("cccdFront", data.cccd.cccdFront);
        if (data.cccd?.cccdBack) formData.append("cccdBack", data.cccd.cccdBack);
        formData.append(
          "store",
          JSON.stringify({
            storeName: values.storeName,
            description: values.description,
          })
        );
        if (values.avatar) {
          formData.append("avatar", values.avatar);
        }

        await registerStore(formData);
        alert("Đăng ký thành công!");
      }}
    >
      {({ setFieldValue, errors, touched }) => (
        <Form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="avatarBtn">
              Avatar/Logo cửa hàng
            </label>
            <Upload
              beforeUpload={(file) => {
                setFieldValue("avatar", file);
                return false;
              }}
              maxCount={1}
            >
              <Button id="avatarBtn">Chọn ảnh</Button>
            </Upload>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="storeName" className="font-medium">
              Tên cửa hàng
            </label>
            <Field as={Input} id="storeName" name="storeName" placeholder="Nhập tên cửa hàng" />
            {touched.storeName && errors.storeName && (
              <div className="text-red-500">{errors.storeName as string}</div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="font-medium">
              Mô tả
            </label>
            <Field
              as={Input.TextArea}
              id="description"
              name="description"
              placeholder="Nhập mô tả"
              rows={4}
            />
            {touched.description && errors.description && (
              <div className="text-red-500">{errors.description as string}</div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={onPrev}>Quay lại</Button>
            <Button type="primary" htmlType="submit">
              Đăng ký
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
