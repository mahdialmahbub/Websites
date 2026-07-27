import React from "react";
import SectionHeader from "./SectionHeader";
import { categories } from "@/app/assets/assets";
import Image from "next/image";

const Category = () => {
  return (
    <section className="section">
      <SectionHeader title={"Category"} />
      <div className="flex gap-space-7 overflow-x-scroll">
        {categories.map((item, i) => (
          <Image width={1000} height={1000}
            alt="item"
            key={i}
            src={item}
            className="h-50 w-auto hover:border-secondary/10 border-2 border-transparent rounded-[16px]"
          />
        ))}
      </div>
    </section>
  );
};

export default Category;
