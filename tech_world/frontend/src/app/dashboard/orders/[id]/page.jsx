import { orders } from "@/app/assets/data";
import Button from "@/app/components/Button";
import OrdersTable from "@/app/components/dashboard/orders/OrderTable";
import StatusBadge from "@/app/components/dashboard/StatusBadge";
import TableToolbar from "@/app/components/dashboard/TableToolbar";
import React from "react";

const page = () => {
  return (
    <div className="px-space-6 pb-space-6 mt-space-3 flex *:flex-1 gap-space-6">
      {/* products */}
      <div className="p-space-5 space-y-space-8 rounded-2xl bg-[#1A1E3D]/50 ">
        <Button
          variant="text"
          showLeftIcon
          leftIcon="fi fi-rr-arrow-small-left"
        />
        <div className="flex items-center justify-between gap-space-7">
          <div className="">
            <h2 className="font-semibold text-size-h6 text-placeholder_2 mb-space-3">
              Order ID
            </h2>
            <h3 className="font-medium text-size-h6">#ORD-10245</h3>
          </div>
          <div className="">
            <h2 className="font-semibold text-size-h6 text-placeholder_2 mb-space-3">
              Date
            </h2>
            <h3 className="font-medium text-size-h6">April 24, 2024</h3>
          </div>
          <div className="">
            <h2 className="font-semibold text-size-h6 text-placeholder_2 mb-space-3">
              Status
            </h2>
            <StatusBadge status={"pending"} />
          </div>
        </div>
        <OrdersTable orders={orders} />
      </div>

      {/* products */}
      <div className="p-space-5 space-y-space-7 rounded-2xl bg-[#1A1E3D]/50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[20px] text-placeholder_3">
            Ship To
          </h2>
          <div className="flex items-center justify-center size-8.5 rounded-lg bg-green/5 hover:border border-green/10 text-size-large text-green">
            <i className="fi fi-rr-edit"></i>
          </div>
        </div>
        <div className="space-y-space-9">
          {/* Customer */}
          <div>
            <h3 className="font-semibold text-size-h6 mb-space-5 text-placeholder_3 ">
              All Orders
            </h3>
            <div className="px-space-2 ">
              <h4 className="font-medium text-[20px] mb-space-3">
                Mahdi Hasan
              </h4>
              <p className="font-semibold text-size-h6">
                House 12, Road 5, Kafrul, Dhaka 1212, Bangladesh.
              </p>
            </div>
          </div>

          {/* contact informations */}
          <div>
            <h3 className="font-semibold text-size-h6 mb-space-5 text-placeholder_3 ">
              Contact Information
            </h3>
            <div className="px-space-2 space-y-space-3">
              <div className="flex items-center ">
                <div className="size-9 bg-secondary/10 text-secondary flex items-center justify-center rounded-full *:text-size-h6">
                  <i className="fi fi-sr-envelope"></i>
                </div>
                <h5 className="font-semibold text-size-h6">
                  mahdiallmahbub@gmail.com
                </h5>
              </div>
              <div className="flex items-center gap-space-2">
                <div className="size-9 bg-secondary/10 text-secondary flex items-center justify-center rounded-full *:text-size-h6">
                  <i className="fi fi-sr-phone-flip"></i>
                </div>
                <h5 className="font-semibold text-size-h6">+880 1811-987654</h5>
              </div>
            </div>
          </div>

          {/* contact informations */}
          <div>
            <h3 className="font-semibold text-size-h6 mb-space-5 text-placeholder_3 ">
              Pricing
            </h3>
            <div className="px-space-2 space-y-space-5">
              <div className="space-y-space-5 p-space-2 rounded-[10px] w-full">
                <div className=" flex items-center justify-between text-[#CBD5F5]">
                  <p className="font-medium text-size-h5 ">Subtotal</p>
                  <h4 className="font-primary font-semibold text-size-h5">
                    $ 9.00
                  </h4>
                </div>

                <div className=" flex items-center justify-between text-[#CBD5F5]">
                  <p className="font-medium text-size-h5 ">Discount</p>
                  <h4 className="font-primary font-semibold text-size-h5">
                    $ 9.00
                  </h4>
                </div>

                <div className=" flex items-center justify-between text-[#CBD5F5]">
                  <p className="font-medium text-size-h5 ">Shipping Charge</p>
                  <h4 className="font-primary font-semibold text-size-h5">
                    $ 9.00
                  </h4>
                </div>

                <div className=" flex items-center justify-between text-[#CBD5F5]">
                  <p className="font-medium text-size-h5 ">VAT</p>
                  <h4 className="font-primary font-semibold text-size-h5">
                    $ 9.00
                  </h4>
                </div>
                <div className="flex items-center justify-between py-space-2 border-t-2 border-placeholder_3/30">
                  <p className="font-medium text-size-h4 text-[#CBD5F5] ">
                    Total
                  </p>
                  <h4 className="font-primary font-semibold text-size-h4 text-secondary">
                    $ 9.00
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
