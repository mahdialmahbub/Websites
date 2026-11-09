// components/ui/TableToolbar.jsx
const TableToolbar = ({ title, children }) => {
  return (
    <div className="flex items-end justify-between mb-space-5">
      <h2 className="text-size-h5 font-semibold text-placeholder_3">{title}</h2>
      <div className="flex items-center gap-space-3">{children}</div>
    </div>
  );
};

export default TableToolbar;
