import { useState } from "react";
import { Plus, Minus, RotateCcw, Table2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  In a real Next.js project, split this file like so:               */
/*  components/skeletons/Skeleton.tsx        -> base primitive        */
/*  components/skeletons/TableHeaderSkeleton.tsx                      */
/*  components/skeletons/TableRowSkeleton.tsx                         */
/*  components/skeletons/OrdersTableSkeleton.tsx  -> composes them,   */
/*    accepts { columns, rows, actionCount } as PROPS (not local      */
/*    state) so the parent decides the counts while data is loading. */
/*  Add "use client" at the top of each file since useState is used.  */
/* ------------------------------------------------------------------ */

const SHIMMER_STYLES = `
  .sk-shimmer {
    position: relative;
    overflow: hidden;
    background: #1c2333;
  }
  .sk-shimmer::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(148,163,184,0.14), transparent);
    animation: sk-shimmer-move 1.6s ease-in-out infinite;
  }
  @keyframes sk-shimmer-move {
    100% { transform: translateX(100%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .sk-shimmer::after { animation: none; }
  }
`;

/* ---------------------------- primitive ---------------------------- */

function Skeleton({ className = "" }) {
  return <div className={`sk-shimmer rounded-md ${className}`} />;
}

/* --------------------------- column config -------------------------- */

const DEFAULT_COLUMNS = [
  { id: "orderId", label: "Order ID" },
  { id: "customer", label: "Customer" },
  { id: "products", label: "Products" },
  { id: "price", label: "Price" },
  { id: "payment", label: "Payment" },
  { id: "actions", label: "Actions" },
];

const HEADER_WIDTHS = ["w-16", "w-20", "w-24", "w-12", "w-16", "w-14"];

function getColumns(count) {
  if (count <= DEFAULT_COLUMNS.length) return DEFAULT_COLUMNS.slice(0, count);
  const extra = Array.from({ length: count - DEFAULT_COLUMNS.length }, (_, i) => ({
    id: `extra-${i}`,
    label: `Column ${DEFAULT_COLUMNS.length + i + 1}`,
  }));
  return [...DEFAULT_COLUMNS, ...extra];
}

/* ------------------------------ header ------------------------------ */

function TableHeaderSkeleton({ columns }) {
  return (
    <thead>
      <tr className="border-b border-slate-800">
        {columns.map((col, i) => (
          <th key={col.id} className="px-6 py-4 text-left">
            <Skeleton className={`h-3 ${HEADER_WIDTHS[i % HEADER_WIDTHS.length]}`} />
          </th>
        ))}
      </tr>
    </thead>
  );
}

/* -------------------------------- cell ------------------------------- */

function RowCell({ type, actionCount }) {
  switch (type) {
    case "orderId":
      return <Skeleton className="h-4 w-24" />;
    case "customer":
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      );
    case "products":
      return (
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      );
    case "price":
      return <Skeleton className="h-4 w-14" />;
    case "payment":
      return <Skeleton className="h-4 w-20" />;
    case "actions":
      return (
        <div className="flex items-center justify-end gap-2">
          {Array.from({ length: actionCount }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg shrink-0" />
          ))}
        </div>
      );
    default:
      return <Skeleton className="h-4 w-16" />;
  }
}

/* -------------------------------- row -------------------------------- */

function TableRowSkeleton({ columns, actionCount }) {
  return (
    <tr className="border-b border-slate-800/60">
      {columns.map((col) => (
        <td
          key={col.id}
          className={`px-6 py-5 ${col.id === "actions" ? "text-right" : ""}`}
        >
          <RowCell type={col.id} actionCount={actionCount} />
        </td>
      ))}
    </tr>
  );
}

/* ---------------------------- composed table --------------------------- */

function OrdersTableSkeleton({ columns, rowCount, actionCount }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
      <table className="w-full min-w-[720px]">
        <TableHeaderSkeleton columns={columns} />
        <tbody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} actionCount={actionCount} />
          ))}
        </tbody>
      </table>
      {rowCount === 0 && (
        <div className="py-10 text-center text-sm text-slate-500">
          Row count 0 — কোনো স্কেলেটন রো নেই
        </div>
      )}
    </div>
  );
}

/* -------------------------------- counter -------------------------------- */

function Counter({ label, value, onChange, min, max }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
        >
          <Minus size={12} />
        </button>
        <span className="w-5 text-center text-sm font-semibold tabular-nums text-white">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- demo page --------------------------------- */

export default function OrdersTableSkeletonDemo() {
  const [columnCount, setColumnCount] = useState(DEFAULT_COLUMNS.length);
  const [rowCount, setRowCount] = useState(2);
  const [actionCount, setActionCount] = useState(3);

  const columns = getColumns(columnCount);

  const reset = () => {
    setColumnCount(DEFAULT_COLUMNS.length);
    setRowCount(2);
    setActionCount(3);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10">
      <style>{SHIMMER_STYLES}</style>

      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
            <Table2 size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Orders Table — Skeleton Loader</h1>
            <p className="text-xs text-slate-500">
              নিচের কন্ট্রোল দিয়ে column, row আর actions আইকনের সংখ্যা লাইভ পরিবর্তন করে দেখো
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <Counter
            label="Header Columns"
            value={columnCount}
            onChange={setColumnCount}
            min={1}
            max={8}
          />
          <Counter label="Rows" value={rowCount} onChange={setRowCount} min={0} max={10} />
          <Counter
            label="Actions per row"
            value={actionCount}
            onChange={setActionCount}
            min={1}
            max={5}
          />
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>

        <OrdersTableSkeleton columns={columns} rowCount={rowCount} actionCount={actionCount} />
      </div>
    </div>
  );
}
