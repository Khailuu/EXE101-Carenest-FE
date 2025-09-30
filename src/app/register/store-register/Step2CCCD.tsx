"use client";
import { Formik, Form } from "formik";
import { Upload, Button } from "antd";
import * as Yup from "yup";
import { CCCDInfo } from "./types";

const schema = Yup.object({
  cccdFront: Yup.mixed().required("Vui lòng upload ảnh mặt trước CCCD"),
  cccdBack: Yup.mixed().required("Vui lòng upload ảnh mặt sau CCCD"),
});

export default function Step2CCCD({
  onNext,
  onPrev,
}: {
  onNext: (data: { cccd: CCCDInfo }) => void;
  onPrev: () => void;
}) {
  return (
    <Formik
      initialValues={{ cccdFront: null, cccdBack: null }}
      validationSchema={schema}
      onSubmit={(values) => {
        onNext({ cccd: values as CCCDInfo });
      }}
    >
      {({ setFieldValue, errors, touched }) => (
        <Form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="cccdFrontBtn">
              Ảnh CCCD mặt trước
            </label>
            <Upload
              beforeUpload={(file) => {
                setFieldValue("cccdFront", file);
                return false;
              }}
              maxCount={1}
            >
              <Button id="cccdFrontBtn">Chọn ảnh</Button>
            </Upload>
            {touched.cccdFront && errors.cccdFront && (
              <div className="text-red-500">{errors.cccdFront as string}</div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="cccdBackBtn">
              Ảnh CCCD mặt sau
            </label>
            <Upload
              beforeUpload={(file) => {
                setFieldValue("cccdBack", file);
                return false;
              }}
              maxCount={1}
            >
              <Button id="cccdBackBtn">Chọn ảnh</Button>
            </Upload>
            {touched.cccdBack && errors.cccdBack && (
              <div className="text-red-500">{errors.cccdBack as string}</div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={onPrev}>Quay lại</Button>
            <Button type="primary" htmlType="submit">
              Tiếp
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
