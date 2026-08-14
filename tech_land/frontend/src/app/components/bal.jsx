"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import { assets, products } from "@/app/assets/assets";
import Image from "next/image";
import StarRating from "@/app/components/StarRating";
import CounterField from "@/app/components/CounterField";
import Button from "@/app/components/Button";
import Chips from "@/app/components/Chips";
import { ProductCard } from "@/app/components/ProductCard";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { id } = useParams();

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound(); // app/product/[id]/not-found.jsx render korbe (thakle)
  }

  return (
    <div>
      <div className="px-space-11 py-space-7">back Button</div>

      {/* product details */}
      <div className="px-space-11">
        {/* images and other info */}
        <div className="mb-space-10 flex gap-space-7">
          {/* images and description */}
          <div>
            {/* images */}
            <div>
              <div className="flex gap-space-7 h-[314px] w-[717px]">
                {/* images */}
                <div className="flex flex-col w-[172px] h-full gap-[15px]"></div>

                {/* Active Image */}
                <div className="h-full w-full">
                  <Image alt="" />
                </div>
              </div>
              <div>
                02<span>/10</span>
              </div>
            </div>

            {/* description and key spacifications */}
            <div className="mt-space-7">
              <p className="font-medium text-[20px] text-placeholder_2 mb-space-8"></p>

              <div className="">
                <h6 className="font-primary font-semibold text-size-h5 text-placeholder_3 mb-space-6">
                  Specifications & Features :
                </h6>

                {/* key spacifications */}
                <div className="flex flex-col gap-space-5"></div>
              </div>
            </div>
          </div>

          {/* title and other info */}
          <div className="flex flex-col gap-space-8">
            {/* tags, title,rating and total sold */}
            <div className="space-y-space-6">
              <div className="flex items-center gap-space-4 flex-wrap"></div>
              <h1 className="font-medium text-size-h2"></h1>
              <div className="flex items-center gap-[11px]">
                <div className="flex items-center gap-space-2">
                  <StarRating rating={5} size={16} />
                  <p className="font-semibold text-size-medium text-placeholder">
                    ( 129 Reviews )
                  </p>
                </div>
                <div className="w-px h-full rounded-full bg-linear-to-b from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0"></div>
                <div className="flex gap-space-1 items-center">
                  <Image
                    alt="fire"
                    src={assets.fire}
                    width={14}
                    height={14}
                    className="w-[14px] h-[14px]"
                  />
                  <p className="font-semibold text-size-medium">
                    <span className="text-placeholder">500+</span> Sold this
                    week
                  </p>
                </div>
              </div>
            </div>

            {/* requirements sellects */}
            <div>
              {/* colors */}
              <div></div>

              {/*  */}
            </div>

            {/* counter and price */}
            <div className="flex items-center justify-between">
              <CounterField
                title="Quantity"
                min={0}
                max={10}
                // value={qty}
                // onChange={(newValue) => setQty(newValue)}
                showInfo={true}
                infoMessage="Maximum 10 per order."
              />
              <div className="flex items-end gap-space-3">
                <p className="text-size-h6 font-primary font-medium text-placeholder_3">
                  $ 1399
                </p>
                <p className="text-size-h2 font-primary font-semibold">
                  $ 1299
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div>
              <div className="flex items-center gap-space-2 mb-[14px]">
                <p className="font-primary text-size-medium font-medium text-placeholder">
                  Cancel Anytime - no fees
                </p>
                <div className="w-px h-full rounded-full bg-linear-to-t from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0"></div>
                <p className="font-primary text-size-medium font-medium text-placeholder">
                  Save 15% - Free shipping
                </p>
              </div>
              <div className="flex gap-space-2">
                <Button variant="secondary" className="w-full">
                  Add to cart
                </Button>
                <Button className="w-full">Buy Now</Button>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center gap-space-2">
              {/* 3rd-party tested */}
              <div className="flex flex-col items-center">
                <div className="w-[50px] h-[50px] bg-secondary/10 rounded-full text-secondary text-[24px] mb-[10px] flex items-center justify-center">
                  <i className="fi fi-rr-shield-check"></i>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-[2px]">
                  <h6 className="font-semibold text-size-h6">
                    3rd-party tested
                  </h6>
                  <p className="text-size-large text-placeholder">
                    for heavy materials
                  </p>
                </div>
              </div>

              {/* 60-days guarantee */}
              <div className="flex flex-col items-center">
                <div className="w-[50px] h-[50px] bg-secondary/10 rounded-full text-secondary text-[24px] mb-[10px] flex items-center justify-center">
                  <i className="fi fi-rr-wrench-alt"></i>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-[2px]">
                  <h6 className="font-semibold text-size-h6">
                    60-days guarantee
                  </h6>
                  <p className="text-size-large text-placeholder">
                    for heavy materials
                  </p>
                </div>
              </div>

              {/* 15-days replacement */}
              <div className="flex flex-col items-center">
                <div className="w-[50px] h-[50px] bg-secondary/10 rounded-full text-secondary text-[24px] mb-[10px] flex items-center justify-center">
                  <i className="fi fi-rr-replace"></i>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-[2px]">
                  <h6 className="font-semibold text-size-h6">
                    15-days replacement
                  </h6>
                  <p className="text-size-large text-placeholder">
                    for heavy materials
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* reviews */}
        <div className="mb-space-10">
          <div className="flex items-center justify-between py-space-2">
            <div className="flex items-center gap-space-2">
              Review{" "}
              <span className="px-[10px] py-[6px] rounded-[6px] bg-secondary/10 text-size-large font-medium text-secondary">
                129
              </span>
            </div>
            <div className=" flex items-center gap-space-3">
              <Chips isIcon text={"All"} />
              <Chips isIcon text={"1"} />
              <Chips isIcon text={"2"} />
              <Chips isIcon text={"3"} />
              <Chips isIcon text={"4"} />
              <Chips isIcon text={"5"} />
            </div>
          </div>

          {/* review card */}
          <div></div>
        </div>

        {/* related products */}
        <div className="">
          <div className="flex items-center justify-between mb-space-7 w-full">
            <h2 className="font-primary text-size-h4 font-semibold">
              Related Products
            </h2>
            <button className="cursor-pointer flex items-center gap-[4px] text-placeholder_3 hover:text-foreground *:transition-all *:duration-200 ">
              <p htmlFor="" className="text-size-h6 font-primary font-medium">
                View More
              </p>
              <i className="fi fi-rr-arrow-small-right"></i>
            </button>
          </div>

          {/* Product Cards */}
          <div className="flex mt-space-7 gap-space-7">
            <ProductCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
