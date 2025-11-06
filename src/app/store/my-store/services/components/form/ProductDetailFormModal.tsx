"use client";
import { Modal, Form, Input, InputNumber, Switch, Button, Select, message } from "antd";
import { JSX, useEffect, useMemo, useState } from "react";
import { productDetailService, ProductDetailData } from "@/services/productDetailService";
import { getAllProductsForSelect } from "@/services/productService";
import { useStoreData } from "../../hooks/useStoreData";

interface ProductDetailFormModalProps {
  open: boolean;
  onCancelAction: () => void;
  onSuccessAction?: () => void;
}

export default function ProductDetailFormModal({ open, onCancelAction, onSuccessAction }: ProductDetailFormModalProps): JSX.Element {
  const [form] = Form.useForm<ProductDetailData & { productId: string }>();
  const { shopId } = useStoreData();
  const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !shopId) return;
    setLoadingOptions(true);
    getAllProductsForSelect(shopId)
      .then((opts) => setProductOptions(opts))
      .catch(() => setProductOptions([]))
      .finally(() => setLoadingOptions(false));
  }, [open, shopId]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      // Process imgUrls: convert to JSON array if it's a string with URLs
      let imgUrls = "";
      if (values.imgUrls) {
        if (typeof values.imgUrls === 'string') {
          // Check if it's already a JSON string
          if (values.imgUrls.startsWith('[')) {
            imgUrls = values.imgUrls;
          } else {
            // Convert comma-separated URLs to JSON array
            const urlArray = values.imgUrls
              .split(',')
              .map((url: string) => url.trim())
              .filter((url: string) => url.length > 0);
            imgUrls = JSON.stringify(urlArray);
          }
        }
      }
      
      await productDetailService.createProductDetail(values.productId, {
        name: values.name,
        price: Number(values.price),
        status: Boolean(values.status),
        discount: Number(values.discount || 0),
        isDefault: Boolean(values.isDefault),
        imgUrls: imgUrls,
        quantityInStock: Number(values.quantityInStock || 0),
      });
    message.success("Tạo chi tiết sản phẩm thành công!");
      form.resetFields();
  onSuccessAction?.();
  onCancelAction();
    } catch (err: any) {
      if (err?.errorFields) return; // validation error
      message.error(err?.message || "Không thể tạo chi tiết sản phẩm");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm Chi tiết Sản phẩm"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancelAction();
      }}
      onOk={handleOk}
      okButtonProps={{ loading: submitting }}
      okText="Thêm mới"
      cancelText="Hủy"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item name="productId" label="Sản phẩm" rules={[{ required: true, message: "Chọn sản phẩm" }]}> 
          <Select
            showSearch
            placeholder="Chọn sản phẩm"
            options={productOptions}
            loading={loadingOptions}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item name="name" label="Tên phiên bản" rules={[{ required: true, message: "Nhập tên" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Nhập giá" }]}>
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="quantityInStock" label="Số lượng kho" rules={[{ required: true, message: "Nhập số lượng" }]}>
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="discount" label="Giảm giá (%)">
          <InputNumber className="w-full" min={0} max={100} />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" valuePropName="checked" initialValue={true}>
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
        </Form.Item>
        <Form.Item name="isDefault" label="Mặc định" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="imgUrls" label="Ảnh (URL hoặc JSON chuỗi)">
          <Input placeholder="https://..., hoặc JSON string" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
