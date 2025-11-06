// src/components/ProductDetailTab.tsx
import { useEffect, useState } from "react";
import {
  AutoComplete,
  Table,
  Card,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Popconfirm,
  message,
  Avatar,
} from "antd";
import { useStoreData } from "../hooks/useStoreData";
import { getAllProductsForSelect } from "@/services/productService";
import { productDetailService, ProductDetailData } from "@/services/productDetailService";

interface ProductOption {
  label: string;
  value: string;
}

export default function ProductDetailTab() {
  const { shopId, isFormModalOpen } = useStoreData();
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [details, setDetails] = useState<ProductDetailData[]>([]);
  const [open, setOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Modal sửa
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDetail, setEditingDetail] = useState<ProductDetailData | null>(null);
  const [form] = Form.useForm();

  // Load products cho AutoComplete
  useEffect(() => {
    if (!shopId) return;
    setLoadingProducts(true);
    getAllProductsForSelect(shopId)
      .then((res) => {
        setOptions(res);
        if (res.length > 0) {
          setSelectedProduct(res[0]);
          fetchProductDetails(res[0].value);
        }
      })
      .finally(() => setLoadingProducts(false));
  }, [shopId]);

  // Refetch when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      console.log("🔄 Refetching product details for:", selectedProduct.value);
      fetchProductDetails(selectedProduct.value);
    }
  }, [selectedProduct?.value]);

  // Refetch when edit modal closes (after update)
  useEffect(() => {
    if (!editModalVisible && selectedProduct && !editingDetail) {
      console.log("🔄 Edit modal closed, refetching product details");
      fetchProductDetails(selectedProduct.value);
    }
  }, [editModalVisible]);

  // Fetch ProductDetail theo productId
  const fetchProductDetails = async (productId: string) => {
    setLoadingDetails(true);
    try {
      const data = await productDetailService.getProductDetailsByProductId(productId);
      setDetails(data);
    } catch (error) {
      message.error("Không thể tải chi tiết sản phẩm");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEdit = (detail: ProductDetailData) => {
    console.log("📝 handleEdit called with detail:", detail);
    setEditingDetail(detail);
    form.setFieldsValue({
      name: detail.name,
      price: detail.price,
      status: detail.status,
      discount: detail.discount,
      isDefault: detail.isDefault,
      imgUrls: detail.imgUrls,
      quantityInStock: detail.quantityInStock,
    });
    setEditModalVisible(true);
    console.log("📝 Modal should be visible now");
  };

  const handleDelete = async (detailId: string) => {
    setLoadingDetails(true);
    try {
      await productDetailService.deleteProductDetail(detailId);
      message.success("Xoá thành công");
      if (selectedProduct) fetchProductDetails(selectedProduct.value);
    } catch (error) {
      message.error("Xoá thất bại");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateDetail = async () => {
    console.log("🔍 handleUpdateDetail START");
    try {
      console.log("🔍 handleUpdateDetail called");
      const values = await form.validateFields();
      console.log("✅ Form validated, values:", values);
      
      if (!editingDetail) {
        console.log("❌ No editingDetail");
        return;
      }
      setLoadingDetails(true);
      console.log("📝 Loading details set to true");
      
      // Process imgUrls like we do in ProductDetailFormModal
      let imgUrls = "";
      if (values.imgUrls) {
        if (typeof values.imgUrls === 'string') {
          if (values.imgUrls.startsWith('[')) {
            imgUrls = values.imgUrls;
          } else {
            const urlArray = values.imgUrls
              .split(',')
              .map((url: string) => url.trim())
              .filter((url: string) => url.length > 0);
            imgUrls = JSON.stringify(urlArray);
          }
        }
      }
      console.log("📤 Sending update request with data:", {
        id: editingDetail.id,
        name: values.name,
        price: Number(values.price),
        status: Boolean(values.status),
        discount: Number(values.discount || 0),
        isDefault: Boolean(values.isDefault),
        imgUrls: imgUrls,
        quantityInStock: Number(values.quantityInStock || 0),
      });
      
      const result = await productDetailService.updateProductDetail(editingDetail.id!, {
        name: values.name,
        price: Number(values.price),
        status: Boolean(values.status),
        discount: Number(values.discount || 0),
        isDefault: Boolean(values.isDefault),
        imgUrls: imgUrls,
        quantityInStock: Number(values.quantityInStock || 0),
      });
      console.log("✅ Update response:", result);
      // Optimistically update current table rows so UI reflects changes immediately
      const updatedRow: ProductDetailData = {
        ...(editingDetail as ProductDetailData),
        name: values.name,
        price: Number(values.price),
        status: Boolean(values.status),
        discount: Number(values.discount || 0),
        isDefault: Boolean(values.isDefault),
        imgUrls: imgUrls,
        quantityInStock: Number(values.quantityInStock || 0),
      };
      setDetails((prev) => prev.map((d) => (d.id === editingDetail?.id ? updatedRow : d)));
      message.success("Cập nhật thành công");
      console.log("✅ Success message shown");
      
      setEditModalVisible(false);
      console.log("✅ Modal closed");
      
      setEditingDetail(null);
      form.resetFields();
      console.log("✅ Form reset");
      
      if (selectedProduct) {
        console.log("🔄 Fetching product details for productId:", selectedProduct.value);
        await fetchProductDetails(selectedProduct.value);
        console.log("🔄 Product details refetched");
      }

      // Force a full page refresh to guarantee latest data from server (as requested)
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 300);
    } catch (error) {
      console.error("❌ Error updating:", error);
      message.error("Cập nhật thất bại");
    } finally {
      setLoadingDetails(false);
      console.log("✅ Loading details set to false");
    }
  };

  return (
    <Card title="Chi tiết sản phẩm">
      <Spin spinning={loadingProducts}>
        <AutoComplete
          options={options}
          style={{ width: 300, marginBottom: 24 }}
          value={selectedProduct?.label || ""}
          open={open}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onSelect={(_, option) => {
            setSelectedProduct(option as ProductOption);
            fetchProductDetails(option.value);
            setOpen(false);
          }}
          onDropdownVisibleChange={(visible) => setOpen(visible)}
          onChange={(input) =>
            setSelectedProduct((s) =>
              s && s.label === input ? s : { label: input, value: "" }
            )
          }
          placeholder="Chọn sản phẩm..."
          filterOption={false} // Hiển thị toàn bộ list khi focus
        />
      </Spin>

      <Spin spinning={loadingDetails}>
        <Table
          dataSource={details}
          columns={[
            { title: "Tên phiên bản", dataIndex: "name", key: "name" },
            {
              title: "Giá",
              dataIndex: "price",
              key: "price",
              render: (val: number) => val?.toLocaleString() + " ₫",
            },
            { title: "Số lượng kho", dataIndex: "quantityInStock", key: "quantityInStock" },
            {
              title: "Ảnh",
              dataIndex: "imgUrls",
              key: "imgUrls",
              render: (val: string) => {
                console.log("imgUrls value:", val, "type:", typeof val);
                if (!val) return "-";
                try {
                  let urls: string[] = [];
                  if (typeof val === 'string') {
                    // Try parsing as JSON first
                    try {
                      const parsed = JSON.parse(val);
                      urls = Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                      // If JSON parsing fails, treat as direct URL
                      urls = [val];
                    }
                  } else if (Array.isArray(val)) {
                    urls = val;
                  }
                  
                  console.log("Parsed urls:", urls);
                  
                  const firstUrl = urls && urls.length > 0 ? urls[0] : null;
                  if (firstUrl && firstUrl.trim()) {
                    return (
                      <Avatar
                        shape="square"
                        size="large"
                        src={firstUrl}
                        alt="Product"
                      />
                    );
                  }
                  return "-";
                } catch (error) {
                  console.error("Error parsing imgUrls:", error, "value:", val);
                  return "-";
                }
              },
              width: 80,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              render: (val: boolean) => (val ? "Hoạt động" : "Ẩn"),
            },
            {
              title: "Hành động",
              key: "action",
              render: (_, record: ProductDetailData) => (
                <>
                  <Button type="link" onClick={() => handleEdit(record)}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Bạn có chắc muốn xoá?"
                    onConfirm={() => handleDelete(record.id!)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>
                      Xoá
                    </Button>
                  </Popconfirm>
                </>
              ),
            },
          ]}
          rowKey="id"
          bordered
          pagination={false}
        />
      </Spin>

      <Modal
        title="Sửa Product Detail"
        open={editModalVisible}
        onCancel={() => {
          console.log("🔴 Modal cancelled");
          setEditModalVisible(false);
          setEditingDetail(null);
          form.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => {
            console.log("🔴 Cancel button clicked");
            setEditModalVisible(false);
            setEditingDetail(null);
            form.resetFields();
          }}>
            Huỷ
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loadingDetails}
            onClick={async () => {
              console.log("✅ UPDATE BUTTON CLICKED - START");
              try {
                await handleUpdateDetail();
                console.log("✅ UPDATE BUTTON CLICKED - END SUCCESS");
              } catch (error) {
                console.log("❌ UPDATE BUTTON CLICKED - END ERROR:", error);
              }
            }}
          >
            Cập nhật
          </Button>,
        ]}
      >
        <Form 
          form={form} 
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên phiên bản"
            rules={[{ required: true, message: "Nhập tên phiên bản" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Nhập giá" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="quantityInStock"
            label="Số lượng kho"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="discount" label="Giảm giá">
            <InputNumber style={{ width: "100%" }} min={0} max={100} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
          </Form.Item>
          <Form.Item name="isDefault" label="Mặc định" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="imgUrls" label="URL ảnh (JSON string)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
