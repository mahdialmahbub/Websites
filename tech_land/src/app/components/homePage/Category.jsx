import React from "react";
import SectionHeader from "./SectionHeader";
import Image from "next/image";
import { CategoryCard } from "../CategoryCard";
import { categories } from "../GetCategory";

const Category = () => {
  return (
    <section className="section"> 
      <SectionHeader title={"Category"} />
      <div className="flex gap-space-7 overflow-x-scroll">
         {categories.map((cat) => (
        <CategoryCard key={cat.id} name={cat.name} slug={cat.slug} image={cat.image} />
      ))}
      </div>
    </section>
  );
};

export default Category;
