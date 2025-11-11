import { Table, Button, Checkbox, Tooltip } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { ServiceOrder, Service, formatCurrency, renderStatusTag } from "../hooks/useOrderData";
import { EnvironmentOutlined } from "@ant-design/icons";

interface OrderServiceTableProps {
    data: ServiceOrder[];
    openDetailsModal: (order: ServiceOrder) => void;
    openConfirmServiceModal: (order: ServiceOrder) => void;
    // Thêm hàm hủy để có thể hủy trực tiếp từ table (nếu cần)
    openCancelServiceModal: (order: ServiceOrder) => void; 
}

const serviceColumns = (props: OrderServiceTableProps): ColumnsType<ServiceOrder> => [
    {
      title: "Mã ĐH",
      dataIndex: "key",
      key: "key",
      width: 100,
      render: (text: string) => (
        <div className="flex items-center">
          <Checkbox 
            checked={false} 
            className="mr-2"
          />
          <span className="font-semibold text-teal-600">SV{text}</span>
        </div>
      )
    },
    {
      title: "Thông tin Khách hàng",
      key: "customerInfo",
      width: 200,
      render: (text: any, record: ServiceOrder) => (
        <div>
          <div className="font-medium">{record.customer}</div>
          <Tooltip title={record.address}>
            <div className="text-gray-500 text-sm truncate w-40">{record.address}</div>
          </Tooltip>
        </div>
      )
    },
    {
      title: "Dịch vụ & Chi nhánh",
      dataIndex: "services",
      key: "services",
      width: 350,
      render: (services: Service[], record: ServiceOrder) => (
        <div>
          <div className="text-sm font-semibold text-teal-700 mb-1">
            <EnvironmentOutlined className="mr-1" />
            {record.branch}
          </div>
          {services.map((service, index) => (
            <div key={index} className="mb-1 text-sm">
              <span className="mr-2">• {service.name}</span>
              <Tooltip title={service.note}>
                <span className="text-gray-500 italic text-xs truncate w-20 inline-block">({service.note || 'Không ghi chú'})</span>
              </Tooltip>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Thời gian",
      key: "time",
      width: 180,
      render: (text: any, record: ServiceOrder) => (
        <div>
          <div className="font-medium text-blue-600">{record.startTime.split(' ')[1]} - {record.endTime.split(' ')[1]}</div>
          <div className="text-xs text-gray-500">{record.startTime.split(' ')[0]}</div>
        </div>
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
      render: (text: any, record: ServiceOrder) => (
        <div className="flex gap-2">
          {/* Nút Xem chi tiết */}
          <Button 
            size="small" 
            type="primary" 
            className="bg-teal-500 hover:bg-teal-600!"
            onClick={() => props.openDetailsModal(record)}
          >
            Xem
          </Button>
          
          {record.status === 'pending' && (
            // Nút Xác nhận (Mở Modal Xác nhận)
            <Button 
              size="small" 
              type="default" 
              className="text-green-500 border-green-500"
              onClick={() => props.openConfirmServiceModal(record)} 
            >
              Xác nhận
            </Button>
          )}
          {/* Thêm nút Hủy nếu muốn hủy trực tiếp */}
          {record.status === 'pending' && (
            <Button 
              size="small" 
              type="default" 
              danger
              onClick={() => props.openCancelServiceModal(record)} 
            >
              Hủy
            </Button>
          )}
        </div>
      )
    }
];

export default function OrderServiceTable(props: OrderServiceTableProps) {
    return (
        <Table<ServiceOrder>
            columns={serviceColumns(props)}
            dataSource={props.data}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1200 }}
            className="orders-table"
        />
    );
}