// components/dashboard/orders/OrdersTable.jsx

import OrderRow from "./OrderRow";

const OrdersTable = ({ orders, isDashboard = true }) => {

console.log(orders)
  return (
    <div className="rounded-2xl border-2 border-secondary/10 px-space-2">
      <table className="w-full text-left border-separate border-spacing-x-0 border-spacing-y-space-3">
        <thead>
          <tr className="text-[#CBD5F5] text-size-h6 *:font-medium *:border-b *:border-secondary/10 *:px-space-3 *:py-space-2">
            <th className="">Order ID</th>
            <th className="">Customer</th>
            <th className="">Product</th>
            <th className="">Status</th>
            <th className="">Quantity</th>
            <th className="">Price</th>
            <th className="">Address</th>

            <th className="">Purchased on</th>

            <th className="">Payment</th>
            <th className=" text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <OrderRow key={order._id} orderId={order._id} isDashboard={isDashboard} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
