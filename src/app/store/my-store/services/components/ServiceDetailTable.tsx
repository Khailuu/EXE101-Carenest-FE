// my-store/services/components/ServiceDetailTable.tsx
import { Table, Button, Popconfirm, Tag } from "antd"; 
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { JSX, useEffect, useState } from "react";
import { ServiceDetailData, ServiceData, ItemType, formatCurrency, renderStatusTag } from '../hooks/useStoreData';
import { serviceDetailService } from '@/services/serviceDetailService';

interface ServiceDetailTableProps {
  data: ServiceDetailData[];
  handleDelete: (key: string, type: ItemType) => void;
  handleOpenFormModal: (item: ServiceDetailData | null) => void;
  serviceData: ServiceData[]; // Dữ liệu Dịch vụ để lấy tên dịch vụ cha
  selectedServiceId: string | null; // Thêm prop selectedServiceId
}

export default function ServiceDetailTable({
  data,
  handleDelete,
  handleOpenFormModal,
  serviceData,
  selectedServiceId, // Nhận selectedServiceId
}: ServiceDetailTableProps): JSX.Element {
    const [filteredDetails, setFilteredDetails] = useState<ServiceDetailData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFilteredServiceDetails = async () => {
            if (selectedServiceId) {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await serviceDetailService.getServiceDetailsByServiceId(selectedServiceId);
                    // setFilteredDetails(response || []);
                } catch (err) {
                    setError("Không thể tải chi tiết dịch vụ.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setFilteredDetails([]); // Clear details if no service is selected
                setIsLoading(false);
            }
        };
        fetchFilteredServiceDetails();
    }, [selectedServiceId]);
    
    // Helper để tìm tên dịch vụ cha
    const getServiceName = (serviceId: string) => {
        const service = serviceData.find(s => s.key === serviceId);
        return service ? service.name : <Tag color="error">Không tìm thấy</Tag>;
    };

    const serviceDetailColumns: ColumnsType<ServiceDetailData> = [
    { title: "ID", dataIndex: "key", key: "key", width: 80 },
    { title: "Tên Chi Tiết", dataIndex: "name", key: "name", width: 200 },
    { 
        title: "Dịch Vụ Cha", 
        dataIndex: "serviceId", 
        key: "serviceId", 
        render: getServiceName, // Dùng Helper
        width: 150 
    },
    { 
        title: "Giá", 
        dataIndex: "price", 
        key: "price", 
        render: (text: number) => <span className="font-semibold">{formatCurrency(text)}đ</span>,
        width: 120,
    },
    { 
        title: "Thời gian", 
        dataIndex: "durationTime", // Đã đổi từ 'duration' sang 'durationTime'
        key: "durationTime", 
        width: 100 
    },
    { title: "Trạng thái", dataIndex: "status", key: "status", render: renderStatusTag, width: 120 },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => handleOpenFormModal(record)} />
          <Popconfirm
            title={`Xác nhận xóa chi tiết: ${record.name}`}
            onConfirm={() => handleDelete(record.key, "service-detail")}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
          </Popconfirm>
        </div>
      ),
      width: 100,
    },
  ];

  if (isLoading) return <p>Đang tải chi tiết dịch vụ...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Table
      columns={serviceDetailColumns}
      dataSource={filteredDetails} // Sử dụng dữ liệu đã lọc
      pagination={{ pageSize: 7, hideOnSinglePage: true }}
      bordered
      className="rounded-lg overflow-hidden"
      scroll={{ x: 1000 }}
    />
  );
}