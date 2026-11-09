/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React from "react";
import OverallDataCard from "../components/dashboard/home/OverallDataCard.jsx";
import OrdersTableSection from "../components/dashboard/orders/OrdersTableSection.jsx";
import ProductsTableSection from "../components/dashboard/products/ProductsTableSection.jsx";
import CustomersTableSection from "../components/dashboard/customers/CustomersTableSection.jsx";
import MessagesTableSection from "../components/dashboard/messages/MessageTableSection.jsx";
import { useGetOverviewStatsQuery } from "@/redux/index.js";
import DeliveryManTableSection from "../components/dashboard/delivery-man/DeliveryManTableSection.jsx";

const page = () => {
  const { data, isLoading } = useGetOverviewStatsQuery();
  const stats = data?.data || {};

  if (isLoading) return <p>Loading overview...</p>;

  return (
    <div className="px-space-6 pb-space-6 mt-space-3">
      <div className="p-space-6 space-y-space-9 rounded-2xl bg-[#1A1E3D]/50">
        {/* overall score */}
        <div className="flex gap-space-6 overflow-x-auto">
          <OverallDataCard
            title="Pending Orders"
            value={stats.pendingOrdersCount}
          />
          <OverallDataCard
            title="Today's Revenue"
            value={`$${stats.todaysRevenue}`}
          />
          <OverallDataCard title="Total Products" value={stats.totalProducts} />
          <OverallDataCard
            title="Total Customers"
            value={stats.totalCustomers}
          />
        </div>

        {/* pending orders */}
        <OrdersTableSection />

        {/* Products */}
        <ProductsTableSection />

        {/* Customers */}
        <CustomersTableSection />

        {/* Messages */}
        <MessagesTableSection />
        
        {/* Delivery Man */}
        <DeliveryManTableSection />
      </div>
    </div>
  );
};

export default page;
