// components/dashboard/orders/OrdersTable.jsx

import OrderItemsRow from "./OrderItemsRow";

const OrdersItemsTable = ({ items }) => {
  console.log(items)
  return (
    <div className="rounded-2xl border-2 border-secondary/10 px-space-2">
      <table className="w-full text-left border-separate border-spacing-x-0 border-spacing-y-space-3">
        <thead>
          <tr className="text-[#CBD5F5] text-size-h6 *:font-medium *:border-b *:border-secondary/10 *:px-space-3 *:py-space-2">
            <th className="">Product</th>

            <th className="">Quantity</th>

            <th className="">Price</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <OrderItemsRow key={item.product} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersItemsTable;
