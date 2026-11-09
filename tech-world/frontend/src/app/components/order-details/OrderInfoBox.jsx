import React from "react";

const OrderInfoBox = ({
  icon = "fi fi-sr-bags-shopping",
  title = "Due",
  subtitle = "Cash on Delivery",
  name = "Payment Status",
}) => {
  return (
    <div className="p-space-4 rounded-[16px] w-[400px] flex gap-space-3">
      <div className="size-[46px] rounded-[8px] bg-secondary/10 flex items-center justify-center *:text-[19px] *:text-secondary">
        <i className={icon}></i>
      </div>
      <div className="">
        <h2 className="font-primary font-semibold text-size-h5 mb-space-1 ">
          {title}
        </h2>

        <p className="font-medium text-size-medium text-placeholder mb-space-3">
          {subtitle}
        </p>

        <p className="font-medium text-size-h6 text-placeholder">{name}</p>
      </div>
    </div>
  );
};

export default OrderInfoBox;
