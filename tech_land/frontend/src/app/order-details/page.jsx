import React from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import Image from "next/image";
import { assets } from "../assets/assets";
import Chips from "../components/Chips";
import Button from "../components/Button";
import Tag from "../components/Tag";
import Boxes from "../components/order-details/Boxes";
import OrderStatusCard from "../components/order-details/OrderStatusCard";
import OrderInfoBox from "../components/order-details/OrderInfoBox";

const Page = () => {
  return (
    <section>
      <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "My orders" }]}
        />
      </div>

      <div className="px-space-11">
        <div className="flex items-center mb-space-10 justify-between">
          <div className="flex items-center gap-space-5">
            <div className="p-space-4 rounded-[12px] bg-secondary/10">
              <i className="fi fi-sr-bags-shopping text-[43px] text-secondary"></i>
            </div>

            <div>
              <h2 className="mb-space-1 font-primary font-semibold text-size-h4">
                Order ID: 12345
              </h2>
              <p className="font-primary font-medium text-size-large text-placeholder_2">
                <span className="text-foreground">Placed on:</span> 22 July
                2026, 10:30 PM
              </p>
            </div>
          </div>

          <div className="p-space-6 rounded-[12px] bg-[#FCE486]/10">
            <div className="flex items-center gap-space-2 mb-space-4">
              <span className="size-[14px] rounded-full bg-[#FCE486]"></span>
              <h3 className="font-primary font-semibold text-size-h4 text-[#FCE486]">
                Pending
              </h3>
            </div>
            <p className="text-size-large font-medium font-primary text-placeholder_2">
              Your Order is being prepared
            </p>
          </div>
        </div>

        {/* product */}
        <div className="flex items-center gap-space-7 w-full">
          {/* image */}
          <Image
            alt="product"
            src={assets.feature_2}
            width={176}
            height={176}
            className="rounded-[8px]"
          />

          {/* details */}
          <div className=" w-full">
            <h1 className="font-medium text-size-h2 mb-space-4">
              NovaTech X15 Pro Gaming Laptop
            </h1>
            <Tag text={"NovaTech"} className={"max-w-max"} />

            <div className="mt-space-6 flex items-center gap-space-6">
              {/* color */}
              <div className="flex items-center gap-space-3">
                <p className="font-medium text-size-h6">Color:</p>
                <span className="bg-red-500 size-[20px] rounded-full"></span>
              </div>

              {/* ram */}
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-size-h6">Ram:</p>
                <Chips text={"8GB"} />
              </div>

              {/* Storage */}
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-size-h6">Storage:</p>
                <Chips text={"8GB"} />
              </div>

              {/* Processor */}
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-size-h6">Processor:</p>
                <Chips text={"i7"} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-space-4 *:w-full">
            <Button
              variant="secondary"
              showLeftIcon
              leftIcon="fi fi-rr-file-download"
            >
              Download Invoice
            </Button>
            <Button
              variant="secondary"
              showLeftIcon
              color={"#00D100"}
              leftIcon="fi fi-rr-phone-flip"
            >
              Contact Seller
            </Button>
            <Button
              variant="secondary"
              showLeftIcon
              color={"#D10000"}
              leftIcon="fi fi-br-cross"
            >
              Cancel Order
            </Button>
          </div>
        </div>

        {/* price and informations */}
        <div className="flex gap-space-7 mt-space-10">
          {/* infos */}
          <div className="space-y-[18px]">
            <div className="flex items-center gap-space-7">
              {/* date */}
              <OrderInfoBox
                icon="fi fi-sr-bags-shopping"
                title="16 july 2026"
                subtitle="2 - 3 days left"
                name="Estimated Delivery"
              />

              <div className="opacity-20 w-0.5 bg-linear-to-b from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 h-full"></div>

              {/* address */}
              <OrderInfoBox
                icon="fi fi-sr-bags-shopping"
                title="House-01, Road-05"
                subtitle="Dhanmondi, Dhaka-1200."
                name="Delivery Address"
              />
            </div>
            <div className="opacity-20 h-0.5 bg-linear-to-r from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 w-full"></div>
            <div className="flex items-center gap-space-7">
              {/* Courier */}
              <OrderInfoBox
                icon="fi fi-sr-bags-shopping"
                title="Tracking ID: 12345"
                subtitle="Pathao"
                name="Courier"
              />

              <div className="shrink-0 opacity-20 bg-linear-to-b from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 w-1.5 h-full"></div>

              {/* Payment Status */}
              <OrderInfoBox
                icon="fi fi-sr-bags-shopping"
                title="Due"
                subtitle="Cash on Delivery"
                name="Payment Status"
              />
            </div>
          </div>

          {/* price */}
          <div className="space-y-space-5 p-space-2 rounded-[10px] w-full">
            <div className=" flex items-center justify-between text-[#CBD5F5]">
              <p className="font-medium text-size-h4 ">Subtotal</p>
              <h4 className="font-primary font-semibold text-size-h4">
                $ 9.00
              </h4>
            </div>

            <div className=" flex items-center justify-between text-[#CBD5F5]">
              <p className="font-medium text-size-h4 ">Discount</p>
              <h4 className="font-primary font-semibold text-size-h4">
                $ 9.00
              </h4>
            </div>

            <div className=" flex items-center justify-between text-[#CBD5F5]">
              <p className="font-medium text-size-h4 ">Shipping Charge</p>
              <h4 className="font-primary font-semibold text-size-h4">
                $ 9.00
              </h4>
            </div>

            <div className=" flex items-center justify-between text-[#CBD5F5]">
              <p className="font-medium text-size-h4 ">VAT</p>
              <h4 className="font-primary font-semibold text-size-h4">
                $ 9.00
              </h4>
            </div>
            <div className="flex items-center justify-between py-space-2 border-t-2 border-placeholder_3/30">
              <p className="font-medium text-size-h3 text-[#CBD5F5] ">Total</p>
              <h4 className="font-primary font-semibold text-size-h3 text-secondary">
                $ 9.00
              </h4>
            </div>
          </div>
        </div>

        {/* ordar status */}
        <div className="flex justify-between mt-space-10">
          <OrderStatusCard isActive />
        </div>

        <div className="w-full h-0.5 bg-linear-to-r from-placeholder_2/0 via-placeholder_2/20 to-placeholder_2/0 my-space-7"></div>

        {/* boxes */}
        <div className=" flex *:flex-1 gap-space-6">
          {/* 1 */}
          <Boxes
            icon="fi fi-rr-shield-check"
            title="3rd-party tested"
            subtitle="for heavy metarials"
          />

          {/* 2 */}
          <Boxes
            icon="fi fi-rr-wrench-alt"
            title="60-days guarantee"
            subtitle="for heavy metarials"
          />

          {/* 3 */}
          <Boxes
            icon="fi fi-rr-replace"
            title="15-days replacement"
            subtitle="for heavy metarials"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
