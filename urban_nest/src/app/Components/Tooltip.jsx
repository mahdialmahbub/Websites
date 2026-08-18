const Tooltip = ({ text = "Best seller" }) => {
  return (
    <div className="absolute top-3 left-3 group">
      {/* Badge icon */}

      {/* Tooltip - hover korle upore ashbe */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none">
        <div className="bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap">
          {text}
        </div>
        {/* Chotto arrow niche */}
        <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
      </div>
    </div>
  );
};

export default Tooltip;
