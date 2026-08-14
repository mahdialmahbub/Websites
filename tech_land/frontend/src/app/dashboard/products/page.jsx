import { orders, products } from "@/app/assets/data";
import OrdersTable from "@/app/components/dashboard/orders/OrderTable";
import ProductsTable from "@/app/components/dashboard/products/ProductsTable";
import Select from "@/app/components/dashboard/Select";
import TableToolbar from "@/app/components/dashboard/TableToolbar";
import SearchBar from "@/app/components/SearchBar";
import React from "react";

const page = () => {
  return (
    <div className="px-space-6 pb-space-6 mt-space-3">
      <div className="p-space-6 space-y-space-9 rounded-2xl bg-[#1A1E3D]/50">
      <TableToolbar title="All Products">
            {/* Select, SearchInput ekhane */}
            <Select />
            <SearchBar />
          </TableToolbar>
          <ProductsTable products={products} isDashboard={false} />
      </div>
    </div>
  );
};

export default page;
