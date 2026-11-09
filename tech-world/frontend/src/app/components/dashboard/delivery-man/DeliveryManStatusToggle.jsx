// components/dashboard/delivery-man/DeliveryManStatusToggle.jsx
"use client";

const DeliveryManStatusToggle = ({ status, onChange, disabled = false }) => {
  const isActive = status === "active";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(isActive ? "inactive" : "active")}
      aria-label={`Mark as ${isActive ? "inactive" : "active"}`}
      className={`
        inline-flex items-center gap-space-2
        px-space-3 py-space-1.5
        rounded-full
        text-size-h6 font-medium
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isActive
            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
        }
      `}
    >
      <span
        className={`size-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
      />
      {isActive ? "Active" : "Inactive"}
    </button>
  );
};

export default DeliveryManStatusToggle;
