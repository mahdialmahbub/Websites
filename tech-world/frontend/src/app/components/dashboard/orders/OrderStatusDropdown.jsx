// components/dashboard/orders/OrderStatusDropdown.jsx
"use client";

import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────
// প্রতিটি status এর জন্য আলাদা color এবং icon
// ⚠️  Bug fix: "Out_for_Delivery" → "Out for Delivery" (space দিয়ে)
//     যাতে STATUS_CONFIG key এবং STATUS_OPTIONS exact match করে
// ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Pending": { color: "#FBBF24", icon: "fi-rr-clock" }, // amber
  "Placed": { color: "#818CF8", icon: "fi-rr-check" }, // indigo
  "Processing": { color: "#C084FC", icon: "fi-rr-settings" }, // purple
  "Packed": { color: "#22D3EE", icon: "fi-rr-box-open" }, // cyan
  "Out for Delivery": { color: "#FB923C", icon: "fi-rr-truck-side" }, // orange
  "Shipped": { color: "#38BDF8", icon: "fi-rr-shipping-fast" }, // sky
  "Delivered": { color: "#4ADE80", icon: "fi-rr-check-circle" }, // green
  "Canceled": { color: "#F87171", icon: "fi-rr-cross-circle" }, // red
};

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);

const OrderStatusDropdown = ({ status = "Pending", onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // fallback: status টা config এ না থাকলে Pending দেখাবে
  const current = STATUS_CONFIG[status] ?? STATUS_CONFIG["Pending"];

  return (
    <div className="relative inline-block" ref={ref}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          color: current.color,
          backgroundColor: `${current.color}1A`, // 10% opacity
          borderColor: `${current.color}30`, // 19% opacity border
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border whitespace-nowrap transition-all hover:brightness-110 active:scale-95"
      >
        <i className={`fi ${current.icon} text-xs leading-none`} />
        <span>{status}</span>

        <i
          className={`fi fi-rr-angle-small-down text-xs leading-none transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* ── Dropdown List ── */}
      {isOpen && (
        <ul className="absolute z-30 mt-2 min-w-[195px] bg-[#0B1120] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
          {STATUS_OPTIONS.map((opt) => {
            const cfg = STATUS_CONFIG[opt];
            const isActive = opt === status;

            return (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                style={
                  isActive
                    ? { backgroundColor: `${cfg.color}15` } // active row highlight
                    : {}
                }
                className="group flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer transition-colors hover:bg-white/5"
              >
                {/* Status icon */}
                <i
                  style={{ color: cfg.color }}
                  className={`fi ${cfg.icon} text-sm leading-none`}
                />

                {/* Label */}
                <span
                  style={{ color: isActive ? cfg.color : undefined }}
                  className={`text-sm flex-1 ${
                    isActive
                      ? "font-semibold"
                      : "text-gray-400 font-medium group-hover:text-gray-200"
                  }`}
                >
                  {opt}
                </span>

                {/* Active tick */}
                {isActive && (
                  <i
                    style={{ color: cfg.color }}
                    className="fi fi-rr-check text-xs ml-auto leading-none"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OrderStatusDropdown;
