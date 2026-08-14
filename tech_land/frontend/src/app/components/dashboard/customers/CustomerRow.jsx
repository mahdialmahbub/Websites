// components/dashboard/customers/CustomerRow.jsx
import Image from "next/image";

const CustomerRow = ({ customer, isDashboard = true }) => {
  return (
    <tr className="bg-secondary/[0.03] hover:bg-secondary/10 transition-colors *:p-space-3 *:first:rounded-l-xl *:last:rounded-r-xl *:text-size-h6">
      <td>
        <div className="flex items-center gap-space-3">
          <div className="relative shrink-0">
            <Image
              src={customer.avatar}
              alt={customer.name}
              width={38}
              height={38}
              className="rounded-full object-cover w-[38px] h-[38px]"
            />
            {customer.isOnline && (
              <span className="absolute bottom-0 right-0 size-[12px] rounded-full bg-green-500 border-2 border-background"></span>
            )}
          </div>
          <div>
            <p className="font-semibold text-size-h6">{customer.name}</p>
            <p className="text-size-medium text-placeholder_3 font-medium">{customer.id}</p>
          </div>
        </div>
      </td>
      <td className="">{customer.email}</td>
      <td className="">{customer.phone}</td>
      <td>${customer.totalSpent}</td>
      {!isDashboard && <td>{customer.totalOrders}</td>}
      <td>
        {new Date(customer.lastOrder).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td>{customer.preferredPayment}</td>
      <td>
        <div className="flex items-center justify-end">
          <button className="p-space-3 rounded-[8px] bg-secondary/5 hover:bg-secondary/15 text-secondary">
            <i className="fi fi-rr-arrow-small-right "></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerRow;
