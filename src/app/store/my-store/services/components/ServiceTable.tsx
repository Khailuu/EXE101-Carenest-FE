"use client";
import {
  Table,
  Button,
  Avatar,
  Popconfirm,
  AutoComplete,
  Row,
  Col,
  Card,
  message,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  ServiceData,
  renderStatusTag,
  useStoreData,
} from "../hooks/useStoreData";
import { categoryService } from "@/services/categoryService";
import { serviceService } from "@/services/serviceService";
import { JSX } from "react";

interface ServiceTableProps {
  data: ServiceData[];
  categoryData: any[];
  handleDelete: (key: string, type: ItemType) => Promise<void>;
  handleOpenFormModal: (item: ServiceData | null) => void;
  isLoading: boolean;
}

export default function ServiceTable({
  data,
  categoryData,
  handleDelete,
  handleOpenFormModal,
  isLoading,
}: ServiceTableProps): JSX.Element {
  const {
    shopId,
    fetchData,
  } = useStoreData();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchCategories = async () => {
      if (!shopId) return;
      try {
        const res = await categoryService.getServiceCategory(shopId);
        const categoryItems = res.items || [];
        setCategories(categoryItems);
        if (categoryItems.length > 0) {
          setSelectedCategoryId(categoryItems[0].id);
        }
      } catch (err) {
        message.error("Không thể tải danh mục dịch vụ!");
      }
    };

    fetchCategories();
  }, [shopId]);

  const options = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const serviceColumns: ColumnsType<ServiceData> = [
    {
      title: "STT",
      dataIndex: "key",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (url: string) => <Avatar shape="square" size="large" src={url} />,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={() => handleOpenFormModal(record)}
          />
          <Popconfirm
            title={`Xóa ${record.name}?`}
            onConfirm={async () => {
              try {
                await serviceService.deleteService(record.key);
                message.success(`Đã xóa dịch vụ ${record.name}!`);
                fetchData();
              } catch (error) {
                message.error("Xóa dịch vụ thất bại!");
              }
            }}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card bordered={false} className="shadow-lg rounded-xl">
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} md={12}>
          <AutoComplete
            style={{ width: "100%" }}
            options={options}
            placeholder="Chọn danh mục dịch vụ"
            value={
              selectedCategoryId
                ? categories.find((c) => c.id === selectedCategoryId)?.name
                : ""
            }
            onSelect={(value) => {
              setSelectedCategoryId(value);
              const name = categories.find((c) => c.id === value)?.name;
              message.success(`Đã chọn danh mục: ${name}`);
            }}
          />
        </Col>
      </Row>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={serviceColumns}
          dataSource={data.filter(service => service.serviceCategoryId === selectedCategoryId)}
          pagination={{ pageSize: 7 }}
          rowKey="id"
        />
      )}
    </Card>
  );
}
