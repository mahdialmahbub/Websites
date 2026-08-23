

import React from "react";
import Hero from "../components/homePage/Hero";
import InfinityScroll from "../components/homePage/InfinityScroll";
import Category from "../components/homePage/Category";
import ForYou from "../components/homePage/ForYou";
import TopSellingProduct from "../components/homePage/TopSellingProduct";
import Feature from "../components/homePage/features/Feature";
import Marketing from "../components/homePage/Marketing";
import FAQ from "../components/homePage/FAQ/FAQ";
import Contact from "../components/homePage/contact/Contact";

const page = () => {

  return (
    <div>
      <Hero />
      <InfinityScroll />
      <Category />
      <ForYou />
      <TopSellingProduct />
      <Feature />
      <Marketing />
      <Contact />
      <FAQ />
    </div>
  );
};

export default page;
