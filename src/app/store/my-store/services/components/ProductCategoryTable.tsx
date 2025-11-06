import { Table, Button, Popconfirm, Empty, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { JSX } from "react";
import { ProductCategoryData, ItemType, useStoreData } from "../hooks/useStoreData";
import { useQueryClient } from '@tanstack/react-query';
import { productCategoryService } from "@/services/productCategoryService";
import ProductCategoryFormModal from "./form/ProductCategoryFormModal";

interface ProductCategoryTableProps {
  data: ProductCategoryData[];
  handleDelete: (key: string, type: ItemType) => Promise<void>;
  handleOpenFormModal: (item: ProductCategoryData | null) => void;
  isLoading?: boolean;
}

export default function ProductCategoryTable({ data, handleDelete, handleOpenFormModal, isLoading = false }: ProductCategoryTableProps): JSX.Element {
  const { shopId, activeTab } = useStoreData();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductCategoryData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenForm = (item?: ProductCategoryData | null) => {
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
        message.warning("Vui lòng nhập tên danh mục sản phẩm!");
        return;
      }

      if (!shopId) {
        message.error("Không tìm thấy Shop ID.");
        return;
      }

      setLoading(true);

      if (editingItem) {
        await productCategoryService.updateProductCategory(editingItem.key, {
          name: values.name,
        });
        message.success("Cập nhật danh mục sản phẩm thành công!");
      } else {
        await productCategoryService.createProductCategory({
          name: values.name,
          shopId,
        });
        message.success("Thêm danh mục sản phẩm thành công!");
      }

      handleCloseForm();
      
      // Invalidate product categories so UI refreshes from React Query cache
      queryClient.invalidateQueries({ queryKey: ["productCategories", shopId] });
    } catch (error) {
      console.error("Error saving product category:", error);
      message.error("Không thể lưu danh mục sản phẩm, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ProductCategoryData> = [
    { title: "ID", dataIndex: "key", key: "key", width: 100 },
    { title: "Tên Danh mục Sản phẩm", dataIndex: "name", key: "name", width: 200 },
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
            title={`Xác nhận xóa danh mục sản phẩm: ${record.name}?`}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.key, "product-category")}
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
      <Spin spinning={isLoading} tip="Đang tải...">
        {data.length === 0 && !isLoading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có danh mục sản phẩm nào, hãy tạo mới."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 7 }}
            rowKey="key"
            loading={isLoading}
          />
        )}
      </Spin>

      <ProductCategoryFormModal
        open={openModal}
        onCancelAction={handleCloseForm}
        onSubmitAction={handleSubmit}
        editingItem={editingItem}
      />
    </>
  );
}
