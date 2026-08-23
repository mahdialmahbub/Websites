// components/dashboard/customers/CustomersTable.jsx
import CustomerRow from "./CustomerRow";

const CustomersTable = ({ customers, isDashboard = true }) => {
  return (
    <div className="rounded-2xl border-2 border-secondary/10 overflow-x-auto px-space-2">
      <table className="w-full text-left border-separate border-spacing-x-0 border-spacing-y-space-3">
        <thead>
          <tr className="text-[#CBD5F5] text-size-h6 *:font-medium *:border-b *:border-secondary/10 *:px-space-3 *:py-space-2">
            <th>Customer</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Total Spent</th>
            {!isDashboard && <th>Total Orders</th>}
            <th>Last Order</th>
            <th>Preferred Payment</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers?.map((customer) => (
            <CustomerRow
              key={customer._id}
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