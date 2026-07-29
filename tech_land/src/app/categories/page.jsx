import React from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import Image from "next/image";
import { CategoryCard } from "../components/CategoryCard";
import { categories } from "../components/GetCategory";

const page = () => {
  return (
    <section className="">
      <div className="px-space-11 py-space-7">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories" }, // last item — no href, highlighted
          ]}
        />
      </div>
      <div className="grid grid-cols-4 gap-space-8 px-space-11">
        {categories.map((cat) => (
        <CategoryCard key={cat.id} name={cat.name} slug={cat.slug} image={cat.image} />
      ))}
      </div>
    </section>
  );
};

export default page;
