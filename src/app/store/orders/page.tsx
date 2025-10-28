"use client";
import { JSX, SetStateAction } from "react";
import { Button, Card, Avatar } from "antd";
import { StatusType, TabType, useOrderData } from "./hooks/useOrderData";

import StatusFilterButtons from "./components/StatusFilterButtons";
import OrderFilters from "./components/OrderFilters";
import OrderServiceTable from "./components/OrderServiceTable";
import OrderProductTable from "./components/OrderProductTable";
import OrderActionModals from "./components/OrderActionModals";

export default function OrdersPage(): JSX.Element {
  const {
    activeTab,
    setActiveTab,
    activeStatus,
    setActiveStatus,
    filteredServiceOrders,
    filteredProductOrders,
    statusButtons,
    openDetailsModal,
    openConfirmServiceModal,
    openCancelServiceModal,
    ...hookData
  } = useOrderData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <StatusFilterButtons
        statusButtons={statusButtons}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
      />

      <Card className="shadow-lg rounded-xl">
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

        <OrderFilters />

        {activeTab === "service" ? (
          <OrderServiceTable 
            data={filteredServiceOrders} 
            openDetailsModal={openDetailsModal}
            openConfirmServiceModal={openConfirmServiceModal}
            openCancelServiceModal={openCancelServiceModal}
          />
        ) : (
          <OrderProductTable data={filteredProductOrders} />
        )}
      </Card>

      <OrderActionModals 
      activeTab={"service"} setActiveTab={function (value: SetStateAction<TabType>): void {
        throw new Error("Function not implemented.");
      } } activeStatus={"processing"} setActiveStatus={function (value: SetStateAction<StatusType>): void {
        throw new Error("Function not implemented.");
      } } filteredServiceOrders={[]} filteredProductOrders={[]} statusButtons={[]} {...hookData}
      openDetailsModal={openDetailsModal}
      openConfirmServiceModal={openConfirmServiceModal}
      openCancelServiceModal={openCancelServiceModal}      />
    </div>
  );
}