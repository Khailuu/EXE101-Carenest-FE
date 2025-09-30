// page.tsx (OrdersPage)

"use client";
import { JSX } from "react";
import { Button, Card, Avatar } from "antd";
import { useOrderData } from "./hooks/useOrderData";

// Components
import StatusFilterButtons from "./components/StatusFilterButtons";
import OrderFilters from "./components/OrderFilters";
import OrderServiceTable from "./components/OrderServiceTable";
import OrderProductTable from "./components/OrderProductTable";

export default function OrdersPage(): JSX.Element {
  const {
    activeTab,
    setActiveTab,
    activeStatus,
    setActiveStatus,
    filteredServiceOrders,
    filteredProductOrders,
    statusButtons,
  } = useOrderData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#E0FAF7] py-6 border-b-4 border-teal-500 mb-6 rounded-lg shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <Avatar
            size={64}
            src="https://i.pravatar.cc/150?img=9"
            className="shadow-md border-2 border-white bg-white"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Chào mừng quay trở lại
            </h1>
            <h2 className="text-3xl font-extrabold text-teal-700">
              Cửa hàng chăm sóc sức khỏe thú cưng Pettiny
            </h2>
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <StatusFilterButtons
        statusButtons={statusButtons}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
      />

      {/* Main Content Card with Filters and Table */}
      <Card className="shadow-lg rounded-xl">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <Button
            type={activeTab === "service" ? "primary" : "text"}
            className={`mr-4 border-b-2 font-semibold ${
              activeTab === "service"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("service")}
          >
            Đơn Hàng Dịch Vụ
          </Button>
          <Button
            type={activeTab === "product" ? "primary" : "text"}
            className={`mr-4 border-b-2 font-semibold ${
              activeTab === "product"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("product")}
          >
            Đơn Hàng Sản Phẩm
          </Button>
        </div>

        {/* Filters and Search */}
        <OrderFilters />

        {/* Table */}
        {activeTab === "service" ? (
          <OrderServiceTable data={filteredServiceOrders} />
        ) : (
          <OrderProductTable data={filteredProductOrders} />
        )}
      </Card>
    </div>
  );
}
