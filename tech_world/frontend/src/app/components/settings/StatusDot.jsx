const StatusDot = ({ colorClass = "bg-red" }) => (
  <span
    className={`size-[8px] shadow-[0px_0px_7px_4px_rgba(212,36,6,0.25)] rounded-full ${colorClass}`}
  ></span>
);

export default StatusDot;
