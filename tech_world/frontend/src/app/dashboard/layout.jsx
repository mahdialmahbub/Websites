import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import RequireAdminAuth from "../components/dashboard/RequireAdminAuth";

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col min-w-[360px] mx-auto">
        <RequireAdminAuth>
          <div className="w-full px-space-6 pt-space-6 pb-space-3 flex items-center justify-center">
            <Navbar isDashboard />
          </div>

          {children}
        </RequireAdminAuth>
      </body>
    </html>
  );
};

export default Layout;
