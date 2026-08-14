// components/ui/StatusBadge.jsx
const statusStyles = {
  pending: "bg-[#FCE486]/10 text-[#FCE486]",
  confirmed: "bg-secondary/10 text-secondary",
  shipped: "bg-blue-500/10 text-blue-500",
  delivered: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
  active: "bg-green-500/10 text-green-500",
  paused: "bg-red-500/10 text-red-500",
  draft: "bg-placeholder_2/10 text-placeholder_2",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-space-3 py-space-1 rounded-full text-size-small font-semibold capitalize ${
      statusStyles[status] || "bg-placeholder_2/10 text-placeholder_2"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;