import React from "react";
import Chips from "../components/Chips";
import SavedCard from "../components/cart/SavedCard";
import SavedAddress from "../components/cart/SavedAddress";
import Button from "../components/Button";
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
            <ProductCard variant="cart"  />
          </div>

          {/* checkout */}
          <div className="rounded-xl p-space-6 space-y-[20px] border-3 border-secondary/20 max-w-[40%]">
            <h2 className="font-medium text-size-h5 text-placeholder_3">
              Payment Summary
            </h2>

            {/* payment method */}
            <div className="p-space-2">
              <h5 className="mb-space-5 font-semibold text-size-h6">
                Payment Method
              </h5>
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
                  <div className="space-y-space-3 mb-space-5">
                    <SavedCard />
                  </div>

                  {/* Add card Button */}
                  <button className="flex items-center justify-center gap-space-2 px-space-4 py-space-3 rounded-[8px] bg-secondary/5 text-secondary border-[1.5px] border-dashed border-secondary w-full text-size-h6 font-primary font-medium">
                    <i className="fi fi-br-plus text-size-h6"></i>
                    Add Card
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 opacity-60"></div>

            {/* Address */}
            <div className="p-space-2">
              <h5 className="mb-space-5 font-semibold text-size-h6">Address</h5>
              <div className="space-y-space-3 mb-space-5">
                <SavedAddress address={"bal"} />
              </div>
              <button className="flex items-center justify-center gap-space-2 px-space-4 py-space-3 rounded-[8px] bg-secondary/5 text-secondary border-[1.5px] border-dashed border-secondary w-full text-size-h6 font-primary font-medium ">
                <i className="fi fi-br-plus text-size-h6"></i>
                Add Address
              </button>
            </div>

            <div className="h-px bg-linear-to-r from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 opacity-60"></div>

            {/* price */}
            <div className="space-y-space-5 p-space-2 rounded-[10px]">
              <div className=" flex items-center justify-between text-[#CBD5F5]">
                <p className="font-medium text-size-h4 ">Subtotal</p>
                <h4 className="font-primary font-semibold text-size-h4">
                  $ 9.00
                </h4>
              </div>

              <div className=" flex items-center justify-between text-[#CBD5F5]">
                <p className="font-medium text-size-h4 ">Discount</p>
                <h4 className="font-primary font-semibold text-size-h4">$ 9.00</h4>
              </div>

              <div className=" flex items-center justify-between text-[#CBD5F5]">
                <p className="font-medium text-size-h4 ">Shipping Charge</p>
                <h4 className="font-primary font-semibold text-size-h4">$ 9.00</h4>
              </div>

              <div className=" flex items-center justify-between text-[#CBD5F5]">
                <p className="font-medium text-size-h4 ">VAT</p>
                <h4 className="font-primary font-semibold text-size-h4">$ 9.00</h4>
              </div>
              <div className="flex items-center justify-between py-space-2 border-t-2 border-placeholder_3/30">
                <p className="font-medium text-size-h3 text-[#CBD5F5] ">Total</p>
                <h4 className="font-primary font-semibold text-size-h3 text-secondary">
                  $ 9.00
                </h4>
              </div>
            </div>

            {/* button */}
            <div className="space-y-space-7">
              <Button className="w-full">Buy Now</Button>
              <div className="flex gap-space-2 *:flex *:flex-col *:items-center *:gap-2.5 *:flex-1">
                <div>
                  <div className="size-[50px] bg-secondary/10 rounded-full flex items-center justify-center">
                    <i className="fi fi-rr-shield-check text-secondary text-[24px]"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-size-h6 mb-0.5">
                      Secure Payment
                    </h5>
                    <p className="text-size-large text-placeholder">
                      for heavy materials
                    </p>
                  </div>
                </div>
                <div>
                  <div className="size-[50px] bg-secondary/10 rounded-full flex items-center justify-center">
                    <i className="fi fi-rr-wrench-alt text-secondary text-[24px]"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-size-h6 mb-0.5">
                      Secure Payment
                    </h5>
                    <p className="text-size-large text-placeholder">
                      for heavy materials
                    </p>
                  </div>
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
