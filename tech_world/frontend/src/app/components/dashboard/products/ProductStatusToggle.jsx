"use client";

/**
 * Simple two-state toggle: Active <-> Paused.
 * `status` — "active" | "paused" (case-insensitive, normalized internally)
 * `onChange` — (newStatus: "Active" | "Paused") => void
 * `disabled` — optional, disables interaction while a request is in flight
 */
const ProductStatusToggle = ({ status, onChange, disabled = false }) => {
  const isActive = status === "Active";

  const handleClick = () => {
    if (disabled) return;
    onChange(isActive ? "Paused" : "Active");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={disabled}
      onClick={handleClick}
      className={`inline-flex items-center gap-space-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          isActive ? "bg-green-500" : "bg-secondary/20"
        }`}
      >
        <span
          className={`inline-block size-4.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
      <span
        className={`text-size-sm font-medium ${
          isActive
            ? "text-green-500"
            : "text-placeholder_2 dark:text-placeholder/80"
        }`}
      >
        {isActive ? "Active" : "Paused"}
      </span>
    </button>
  );
};

export default ProductStatusToggle;
