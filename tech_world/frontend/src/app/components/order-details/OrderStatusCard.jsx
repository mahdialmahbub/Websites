const OrderStatusCard = ({
  icon = "fi fi-br-check",
  title = "Order Placed",
  date = "12 July, 10:30 PM",
  isActive = false,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          size-15.5
          rounded-xl
          flex
          items-center
          justify-center
          mb-space-4
          text-[26px]
          ${
            isActive
              ? "bg-secondary/10 text-secondary"
              : "bg-placeholder/10 text-placeholder"
          }
        `}
      >
        <i className={icon} />
      </div>

      <h3
        className={`
          font-semibold
          text-size-h6
          mb-1.5
          ${
            isActive
              ? "text-secondary"
              : "text-placeholder_2"
          }
        `}
      >
        {title}
      </h3>

      {isActive && (
        <time className="font-medium text-size-large text-placeholder_2">
          {date}
        </time>
      )}
    </div>
  );
};

export default OrderStatusCard;