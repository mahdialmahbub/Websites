"use client";

// app/category/[slug]/page.jsx
import { products } from "@/app/assets/assets";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import SectionHeader from "@/app/components/homePage/SectionHeader";
import { ProductCard } from "@/app/components/ProductCard";
import { useParams } from "next/navigation";

function toCardData(product) {
  return {
    image: product.images?.[0],
    badge: product.category,
    title: product.title,
    rating: product.rating,
    reviewCount: product.reviewCount,
    price: product.price,
    originalPrice: product.originalPrice,
    buttonText: "Add to cart",
  };
}

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { slug } = useParams();

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === slug.toLowerCase(),
  );

  return (
    <div className="">
      <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: slug }, // last item — no href, highlighted
          ]}
        />
        <SectionHeader type="product" title={slug} />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-slate-400">No products found in this category.</p>
      ) : (
        <div className="flex flex-wrap gap-4 px-space-11">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              variant="primary"
              data={toCardData(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
