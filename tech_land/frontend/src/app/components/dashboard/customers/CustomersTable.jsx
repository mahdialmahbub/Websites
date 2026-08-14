// components/dashboard/customers/CustomersTable.jsx
import CustomerRow from "./CustomerRow";

const CustomersTable = ({ customers, isDashboard = true }) => {
  return (
    <div className="rounded-[16px] border-2 border-secondary/10 overflow-x-auto px-space-2">
      <table className="w-full text-left border-separate border-spacing-x-0 border-spacing-y-space-3">
        <thead>
          <tr className="text-[#CBD5F5] text-size-h6 *:font-medium *:border-b *:border-secondary/10  *:px-space-3 *:py-space-2">
            <th className="">Customer</th>
            <th className="">Email</th>
            <th className="">Phone Number</th>
            <th className="">Total Spent</th>
            {!isDashboard && (
              <th className="">Total Orders</th>
            )}
            <th className="">Last Order</th>
            <th className="">Preferred Payment</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers?.map((customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              isDashboard={isDashboard}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
