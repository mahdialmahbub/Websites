"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { useGetPublicCategoriesQuery, useGetProductsQuery } from "@/redux";
import { useDebounce } from "@/app/hooks/useDebounce";

const money = (n) => `$ ${Number(n || 0).toFixed(2)}`;

const Navbar_Searchbar = () => {
  const router = useRouter();

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // null = "All"
  const [searchText, setSearchText] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);

  const categoryRef = useRef(null);
  const wrapperRef = useRef(null);

  const { data: categoriesData } = useGetPublicCategoriesQuery();
  const categories = categoriesData?.data || [];

  const debouncedSearch = useDebounce(searchText, 400);

  const { data: resultsData, isFetching } = useGetProductsQuery(
    { search: debouncedSearch, category: selectedCategory?._id, limit: 6 },
    { skip: !debouncedSearch }
  );
  const results = resultsData?.data?.products || [];

  // Close both dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setResultsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCategoryOpen(false);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setResultsOpen(false);
  };

  const goToProduct = (id) => {
    router.push(`/product/${id}`);
    setResultsOpen(false);
    setSearchText("");
  };

  return (
    <div ref={wrapperRef} className="relative w-150">
      <div className="bg-background border-[1.5px] border-secondary/10 h-[48px] flex items-center gap-2.5 rounded-lg w-full">
        {/* category select */}
        <div ref={categoryRef} className="relative flex items-center">
          <button
            type="button"
            onClick={() => setCategoryOpen((prev) => !prev)}
            className="flex items-center justify-center px-3 gap-0.5"
          >
            <span className="font-primary text-md text-placeholder_2">{selectedCategory?.name || "All"}</span>
            <i
              className={`fi fi-rr-caret-down flex items-center justify-center text-size-large transition-transform ${
                categoryOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>
          <div className="w-0.5 h-6 bg-placeholder_2/30" />

          {categoryOpen && (
            <ul className="absolute top-full left-0 mt-2 min-w-45 max-h-64 overflow-y-auto bg-[#0B1120] border border-secondary/20 rounded-lg shadow-lg z-30">
              <li
                onClick={() => handleSelectCategory(null)}
                className={`px-space-3 py-space-2 text-size-large cursor-pointer hover:bg-secondary/10 ${
                  !selectedCategory ? "text-secondary" : "text-placeholder_2"
                }`}
              >
                All
              </li>
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-space-3 py-space-2 text-size-large cursor-pointer hover:bg-secondary/10 ${
                    selectedCategory?._id === cat._id ? "text-secondary" : "text-placeholder_2"
                  }`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setResultsOpen(true);
          }}
          onFocus={() => setResultsOpen(true)}
          placeholder="Find your next favorite tech..."
          className="w-full p-0 text-size-h6 text-foreground placeholder:text-placeholder_3 font-medium outline-none"
        />

        {/* Clear icon — only when there's something to clear */}
        {searchText && (
          <i
            onClick={handleClearSearch}
            className="fi fi-rr-cross-circle flex items-center justify-center text-red text-size-h5 mr-space-[6px] cursor-pointer"
          ></i>
        )}

        <button type="button" onClick={() => setResultsOpen(true)} className="py-space-3 px-space-4 h-full bg-secondary text-background rounded-lg">
          <i className="fi fi-br-search"></i>
        </button>
      </div>

      {/* results dropdown */}
      {resultsOpen && debouncedSearch && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#0B1120] border border-secondary/20 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
          {isFetching ? (
            <p className="p-space-4 text-sm text-placeholder_2">Searching...</p>
          ) : results.length === 0 ? (
            <p className="p-space-4 text-sm text-placeholder_2">No products found.</p>
          ) : (
            results.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => goToProduct(product._id)}
                className="flex items-center gap-space-3 w-full p-space-3 hover:bg-secondary/5 text-left"
              >
                <Image
                  src={product.images?.[0]?.url}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
                  <div className="flex items-center gap-1 text-xs text-placeholder_2">
                    <Star size={11} className="fill-secondary text-secondary" />
                    {product.rating?.average || 0}
                  </div>
                </div>
                <p className="text-sm font-semibold text-secondary shrink-0">{money(product.startingPrice)}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar_Searchbar;
