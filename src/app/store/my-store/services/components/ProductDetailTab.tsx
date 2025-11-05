import { useEffect, useState } from "react";
import { AutoComplete, Table, Card } from "antd";
import { getAllProductsForSelect } from "@/services/productService";
import { useStoreData } from "../hooks/useStoreData"; // Nếu cần dùng shopId

const PRODUCT_DETAIL_URL = process.env.NEXT_PUBLIC_MANAGE_PRODUCT_DETAIL_URL;

export default function ProductDetailTab() {
  const { shopId } = useStoreData(); // lầy shopId từ hook
  const [options, setOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    if (!shopId) return;
    getAllProductsForSelect(shopId).then(res => {
      setOptions(res); // Quan trọng phải set state options sau khi lấy data!
      if (res.length > 0) {
        setSelectedProduct(res[0]);
        fetchProductDetails(res[0].value); // res[0].value là id đầu tiên
      }
    });
  }, [shopId]);

  const fetchProductDetails = async (id: string) => {
    const url = `${PRODUCT_DETAIL_URL}?pageIndex=1&pageSize=10&sortDirection=asc&productId=${id}`;
    const res = await fetch(url);
    const json = await res.json();
    setDetails(json.data?.items ?? []);
  };

  return (
    <Card title="Chi tiết sản phẩm">
      <AutoComplete
        options={options}
        style={{ width: 300, marginBottom: 24 }}
        value={selectedProduct?.label || ""}
        onSelect={(_, option) => {
          setSelectedProduct(option);
          fetchProductDetails(option?.value as string);
        }}
        // Đảm bảo khung nhập hiển thị đúng label luôn
        onChange={inputVal => setSelectedProduct(
          options.find(opt => opt.label === inputVal) || { label: inputVal, value: "" }
        )}
        placeholder="Chọn sản phẩm..."
        filterOption={(inputValue, option) => (option?.label as string)?.toLowerCase().includes(inputValue.toLowerCase())}
      />
      <Table dataSource={details} columns={[
        { title: "Tên phiên bản", dataIndex: "name", key: "name" },
        { title: "Giá", dataIndex: "price", key: "price", render: (val: number) => val?.toLocaleString() + " ₫" },
        { title: "Số lượng kho", dataIndex: "quantityInStock", key: "quantityInStock" },
        { title: "Trạng thái", dataIndex: "status", key: "status", render: (val: boolean) => val ? "Hoạt động" : "Ẩn" }
      ]}
        rowKey="id"
        bordered
        pagination={false}
      />
    </Card>
  );
}
