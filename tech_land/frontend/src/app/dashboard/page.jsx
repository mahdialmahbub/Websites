import React from "react";
import OverallDataCard from "../components/dashboard/home/OverallDataCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import TableToolbar from "../components/dashboard/TableToolbar.jsx";
import OrdersTable from "../components/dashboard/orders/OrderTable.jsx";
import Select from "../components/dashboard/Select.jsx";
import { customers, messages, orders, products } from "../assets/data.js";
import ProductsTable from "../components/dashboard/products/ProductsTable.jsx";
import CustomersTable from "../components/dashboard/customers/CustomersTable.jsx";
import MessagesTable from "../components/dashboard/messages/MessagesTable.jsx";
import ViewMessageModal from "../components/dashboard/messages/ViewMessageModal.jsx";
import LocationSelectModal from "../components/dashboard/LocationSelectModal.jsx";

const page = () => {
  return (
    <div className="px-space-6 pb-space-6 mt-space-3">
      <div className="p-space-6 space-y-space-9 rounded-[16px] bg-[#1A1E3D]/50">
        {/* overall score */}
        <div className="flex gap-space-6 overflow-x-auto">
          <OverallDataCard isMessage />
        </div>

        {/* pending orders */}
        <div className="">
          <TableToolbar title="Pending Orders">
            {/* Select, SearchInput ekhane */}
            <Select />
            <SearchBar />
          </TableToolbar>
          <OrdersTable orders={orders} />
        </div>

        {/* Products */}
        <div className="">
          <TableToolbar title="Products">
            {/* Select, SearchInput ekhane */}
            <Select />
            <SearchBar />
          </TableToolbar>
          <ProductsTable products={products} />
        </div>

        {/* Customers */}
        <div className="">
          <TableToolbar title="Customers">
            {/* Select, SearchInput ekhane */}
            <Select />
            <SearchBar />
          </TableToolbar>
          <CustomersTable customers={customers} />
        </div>

        {/* Messages */}
        <div className="">
          <TableToolbar title="Messages">
            {/* Select, SearchInput ekhane */}
            <SearchBar />
          </TableToolbar>
          <MessagesTable messages={messages} />
        </div>
        <ViewMessageModal />
        <LocationSelectModal />
      </div>
    </div>
  );
};

export default page;
