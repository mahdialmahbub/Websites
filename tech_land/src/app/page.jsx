import React from "react";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/homePage/Hero";
import InfinityScroll from "./components/homePage/InfinityScroll";
import Category from "./components/homePage/Category";
import ForYou from "./components/homePage/ForYou";
import Feature from "./components/homePage/features/Feature";
import Marketing from "./components/homePage/Marketing";
import Contact from "./components/homePage/contact/Contact";
import FAQ from "./components/homePage/FAQ/FAQ";
import FInalCTA from "./components/homePage/FInalCTA";
import Footer from "./components/Footer";
import TopSellingProduct from "./components/homePage/TopSellingProduct";

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
      <FInalCTA />
    </div>
  );
};

export default page;
