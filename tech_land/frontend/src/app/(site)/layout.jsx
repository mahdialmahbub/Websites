import Footer from "../components/Footer";
import Navbar from "../components/navbar/Navbar";

// app/(site)/layout.jsx (public pages only)
const SiteLayout = ({ children }) => {
  return (
    <>
      <div className="w-full px-space-8 py-space-7 flex items-center justify-center">
        <Navbar />
      </div>
      {children}
      <div className="w-full px-space-8 py-space-8">
        <Footer />
      </div>
    </>
  );
};

export default SiteLayout;