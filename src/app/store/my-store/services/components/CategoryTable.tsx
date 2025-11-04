"use client";
import { Table, Button, Popconfirm, Empty, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { JSX } from "react";
import { CategoryData, ItemType, useStoreData } from "../hooks/useStoreData";
import { categoryService } from "@/services/categoryService";
import CategoryFormModal from "./CategoryFormModal";

interface CategoryTableProps {
  data: CategoryData[];
  handleDelete: (key: string, type: ItemType) => Promise<void>;
  handleOpenFormModal: (item: CategoryData | null) => void;
}

export default function CategoryTable({ data, handleDelete, handleOpenFormModal }: CategoryTableProps): JSX.Element {
  const { fetchData } = useStoreData();
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryData | null>(null);

  const handleOpenForm = (item?: CategoryData | null) => {
    setEditingItem(item || null);
    setOpenModal(true);
  };

  const handleCloseForm = () => {
    setOpenModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (!values.name) {
        message.warning("Vui lòng nhập tên danh mục!");
        return;
      }

      const token = localStorage.getItem("authToken") || "";
      if (!token) {
        message.error("Không tìm thấy token đăng nhập.");
        return;
      }

      const shopId = localStorage.getItem("shopId");
      if (!shopId) {
        message.error("Không tìm thấy shopId.");
        return;
      }

      if (editingItem) {
        await categoryService.updateServiceCategory(editingItem.key, {
          name: values.name,
          shopId,
        });
        message.success("Cập nhật danh mục thành công!");
      } else {
        await categoryService.createServiceCategory({
          name: values.name,
          shopId,
        });
        message.success("Thêm danh mục thành công!");
      }

      handleCloseForm();
      fetchData();
    } catch (error) {
      message.error("Không thể lưu danh mục, vui lòng thử lại!");
    }
  };

  const columns: ColumnsType<CategoryData> = [
    { title: "ID", dataIndex: "key", key: "key", width: 100 },
    { title: "Tên danh mục", dataIndex: "name", key: "name", width: 200 },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={() => handleOpenForm(record)}
          />
          <Popconfirm
            title={`Xác nhận xóa danh mục: ${record.name}?`}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.key, "category")}
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
    <>
      {data.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có danh mục nào, hãy tạo mới."
        />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 7 }}
          rowKey="key"
        />
      )}

      <CategoryFormModal
        open={openModal}
        onCancel={handleCloseForm}
        onSubmit={handleSubmit}
        editingItem={editingItem}
      />
    </>
  );
}
