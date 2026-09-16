// components/dashboard/orders/OrdersTable.jsx

import OrderRow from "./OrderRow";

const OrdersTable = ({ orders, isDashboard = true }) => {
  return (
    <div className="rounded-2xl border-2 border-secondary/10 px-space-2">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-secondary/20 scrollbar-track-transparent">
        <table className="w-full min-w-[1280px] text-left border-separate border-spacing-x-0 border-spacing-y-space-3">
          <thead>
            <tr className="text-[#CBD5F5] text-size-h6 *:font-medium *:border-b *:border-secondary/10 *:px-space-3 *:py-space-2 *:whitespace-nowrap">
              <th className="w-[110px]">Order ID</th>
              <th className="w-[220px]">Customer</th>
              <th className="w-[180px]">Product</th>
              <th className="w-[150px]">Status</th>
              <th className="w-[90px]">Quantity</th>
              <th className="w-[100px]">Price</th>
              <th className="w-[240px]">Address</th>
              <th className="w-[130px]">Purchased on</th>
              <th className="w-[130px]">Payment</th>
              <th className="w-[130px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <OrderRow
                key={order._id}
                orderId={order._id}
                isDashboard={isDashboard}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;