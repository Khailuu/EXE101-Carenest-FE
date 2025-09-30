// components/OrderProductTable.tsx

import { Table, Button, Checkbox, Tooltip } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { ProductOrder, Product, formatCurrency, renderStatusTag } from "../hooks/useOrderData";

interface OrderProductTableProps {
    data: ProductOrder[];
}

const productColumns: ColumnsType<ProductOrder> = [
    {
        title: "Mã ĐH",
        dataIndex: "key",
        key: "key",
        width: 100,
        render: (text: string, record: ProductOrder) => (
          <div className="flex items-center">
            <Checkbox 
              checked={false} 
              className="mr-2"
            />
            <span className="font-semibold text-teal-600">SP{text}</span>
          </div>
        )
      },
      {
        title: "Thông tin Khách hàng",
        key: "customerInfo",
        width: 200,
        render: (text: any, record: ProductOrder) => (
          <div>
            <div className="font-medium">{record.customer}</div>
            <div className="text-gray-500 text-sm">{record.phone}</div>
          </div>
        )
      },
      {
        title: "Sản phẩm (SL)",
        dataIndex: "products",
        key: "products",
        width: 350,
        render: (products: Product[], record: ProductOrder) => (
          <div className="text-sm">
            {products.map((product, index) => (
              <div key={index} className="mb-1 flex justify-between">
                <span className="truncate mr-2">• {product.name}</span>
                <span className="font-semibold text-gray-700">x{product.quantity}</span>
              </div>
            ))}
            <div className="text-xs text-teal-600 mt-1 pt-1 border-t border-dashed">
              Tổng: {products.length} mặt hàng
            </div>
          </div>
        )
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        width: 250,
        ellipsis: true,
        render: (address: string) => (
          <Tooltip title={address}>
            <span className="text-gray-600">{address}</span>
          </Tooltip>
        )
      },
      {
        title: "Tổng tiền",
        dataIndex: "total",
        key: "total",
        width: 120,
        render: (text: number) => <span className="font-bold text-red-600">{formatCurrency(text)}</span>
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: renderStatusTag
      },
      {
        title: "Thao tác",
        key: "action",
        width: 150,
        render: (text: any, record: ProductOrder) => (
          <div className="flex gap-2">
            <Button size="small" type="primary" className="bg-teal-500 hover:!bg-teal-600">Xem</Button>
            {record.status === 'pending' && (
              <Button size="small" type="default" className="text-green-500 border-green-500">Giao hàng</Button>
            )}
          </div>
        )
      }
];

export default function OrderProductTable({ data }: OrderProductTableProps) {
    return (
        <Table<ProductOrder>
            columns={productColumns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1200 }}
            className="orders-table"
        />
    );
}