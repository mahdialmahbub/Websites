import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import RequireAdminAuth from "../components/dashboard/RequireAdminAuth";

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body className="">
        <RequireAdminAuth>
            <Navbar isDashboard />

          {children}
        </RequireAdminAuth>
      </body>
    </html>
  );
};

export default Layout;
