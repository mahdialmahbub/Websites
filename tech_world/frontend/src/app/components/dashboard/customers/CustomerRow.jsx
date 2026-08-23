// components/dashboard/customers/CustomerRow.jsx
import Image from "next/image";
import Link from "next/link";

const CustomerRow = ({ customer, isDashboard = true }) => {
  return (
    <tr className="bg-secondary/3 hover:bg-secondary/10 transition-colors *:p-space-3 *:first:rounded-l-xl *:last:rounded-r-xl *:text-size-h6">
      <td>
        <div className="flex items-center gap-space-3">
          <div className="relative shrink-0">
            <Image
              src={customer.image?.url || "/placeholder-avatar.png"}
              alt={customer.name}
              width={38}
              height={38}
              className="rounded-full object-cover w-9.5 h-9.5"
            />
          </div>
          <div>
            <p className="font-semibold text-size-h6">{customer.name}</p>
            <p className="text-size-medium text-placeholder_3 font-medium">
              {customer._id}
            </p>
          </div>
        </div>
      </td>
      <td>{customer.email}</td>
      <td>{customer.phone || "—"}</td>
      <td>{customer.totalSpent != null ? `$${customer.totalSpent}` : "—"}</td>
      {!isDashboard && <td>{customer.totalOrders ?? "—"}</td>}
      <td>
        {customer.lastOrder
          ? new Date(customer.lastOrder).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </td>
      <td>{customer.preferredPayment || "—"}</td>
      <td>
        <div className="flex items-center justify-end">
          <Link
            href={`/dashboard/customers/${customer._id}`}
            aria-label="view detail"
            className="p-space-3 rounded-lg bg-secondary/5 hover:bg-secondary/15 text-secondary transition-colors"
          >
            <i className="fi fi-rr-arrow-small-right" />
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default CustomerRow;
