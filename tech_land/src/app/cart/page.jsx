import React from "react";
import Chips from "../components/Chips";
import { ProductCard } from "../components/ProductCard";

const page = () => {
  return (
    <div>
      <div className="px-space-11 py-space-7">back Button</div>
      <div className="px-space-11">
        {/* header */}
        <div className="flex mb-space-8 items-center justify-between">
          <div className="flex items-center gap-space-5">
            <div className="flex items-center gap-space-4">
              <i className="fi fi-rr-cart-shopping-fast text-[30px] text-secondary"></i>
              <h1 className="font-primary font-semibold text-size-h4">
                Your Cart Items
              </h1>
            </div>
            <Chips text={"03"} />
          </div>
          <p className="font-primary font-semibold text-size-large text-placeholder_2">
            Good gadget, better tomorrow.
          </p>
        </div>

        {/* cart items and checkout */}
        <div className="flex gap-space-7">
          {/* products */}
          <div className="space-y-space-6 w-[750px] *:w-full">
            <ProductCard variant="cart" />
          </div>

          {/* checkout */}
          <div className="rounded-[12px] p-space-6 space-y-[20px] border-3 border-secondary/20">
            <h2 className="font-medium text-size-h5 text-placeholder_3">
              Payment Summary
            </h2>

            {/* payment method */}
            <div className="">
              <p className="mb-space-5 font-semibold text-size-h6">
                Payment Method
              </p>
              <div className="space-y-space-5">
                <div className="flex items-center gap-space-5">
                  <button className="flex  items-center gap-space-2 px-[20px] py-space-4 rounded-[8px] font-semibold text-size-h6">
                    <i className="fi fi-rr-money-bill-wave text-[24px]"></i>
                    Cash on Delivery
                  </button>
                  <button className="flex  items-center gap-space-2 px-[20px] py-space-4 rounded-[8px] font-semibold text-size-h6">
                    <i className="fi fi-rr-money-bill-wave text-[24px]"></i>
                    Cash on Delivery
                  </button>
                </div>
                <div>

                  {/* cards */}
                  <div className="space-y-space-3">
                    
                  </div>

                  {/* Add card Button */}
                  <button className="flex items-center justify-center gap-space-2 px-space-4 py-space-3 rounded-[8px] bg-secondary/5 text-secondary border-[1.5px] border-dashed border-secondary w-full">
                  <i className="fi fi-br-plus text-size-h6"></i>

                  </button>
                  
                </div>
              </div>
            </div>

            {/* payment method */}
            <div></div>

            {/* payment method */}
            <div></div>

            {/* payment method */}
            <div></div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
