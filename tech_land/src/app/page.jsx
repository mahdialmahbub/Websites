import React from "react";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/homePage/Hero";
import InfinityScroll from "./components/homePage/InfinityScroll";
import Category from "./components/homePage/Category";
import ForYou from "./components/homePage/ForYou";
import Feature from "./components/homePage/features/Feature";
import Marketing from "./components/homePage/Marketing";
import Contact from "./components/homePage/contact/Contact";

const page = () => {
  return (
    <div>
      <div className="w-full px-space-8 py-space-7 flex items-center justify-center">
        <Navbar />
      </div>
      <Hero />
      <InfinityScroll />
      <Category />
      <ForYou />
      <Feature />
      <Marketing />
      <Contact />
    </div>
  );
};

export default page;
