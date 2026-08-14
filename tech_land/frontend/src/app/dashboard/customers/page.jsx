import { customers, orders } from "@/app/assets/data";
import CustomersTable from "@/app/components/dashboard/customers/CustomersTable";
import OrdersTable from "@/app/components/dashboard/orders/OrderTable";
import Select from "@/app/components/dashboard/Select";
import TableToolbar from "@/app/components/dashboard/TableToolbar";
import SearchBar from "@/app/components/SearchBar";
import React from "react";

const page = () => {
  return (
    <div className="px-space-6 pb-space-6 pt-space-3">
      <div className="p-space-6 space-y-space-9 rounded-[16px] bg-[#1A1E3D]/50">
      <TableToolbar title="All Customers">
            {/* Select, SearchInput ekhane */}
            <Select />
            <SearchBar />
          </TableToolbar>
          <CustomersTable customers={customers} isDashboard={false} />
      </div>
    </div>
  );
};

export default page;
