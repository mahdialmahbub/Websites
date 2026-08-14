import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col w-[360px] mx-auto">
        <div className="w-full px-space-6 pt-space-6 pb-space-3 flex items-center justify-center">
          <Navbar isDashboard />
        </div>

        {children}

      </body>
    </html>
  );
};

export default Layout;