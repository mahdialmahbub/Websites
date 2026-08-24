"use client";

import { assets } from "@/app/assets/assets";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar_Searchbar from "./Navbar_Searchbar";
import NavItem from "../dashboard/NavItem";
import Link from "next/link";
import ProfileCard from "../ProfileCard";
import {
  useGetMyProfileQuery,
  useAdminLogoutMutation,
  useGetMyWishlistQuery,
} from "@/redux";

const Navbar = ({ isDashboard }) => {
  const router = useRouter();

  // Fetches (and hydrates) the logged-in customer's profile — if there's no
  // valid session, this just silently fails and `profile` stays undefined.
  const { data: profileData } = useGetMyProfileQuery(undefined, {
    skip: !!isDashboard,
  });
  const customer = profileData?.data;
  const isLoggedIn = !!customer;

  const { data: wishlistData } = useGetMyWishlistQuery(undefined, {
    skip: !isLoggedIn,
  });
  const wishlistCount = wishlistData?.data?.length || 0;

  const [adminLogout] = useAdminLogoutMutation();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAdminLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  const dashboardNavItems = [
    {
      text: "Dashboard",
      href: "/dashboard",
      stockIcon: "fi fi-rr-dashboard-panel",
      fillIcon: "fi fi-sr-dashboard-panel",
    },
    {
      text: "Orders",
      href: "/dashboard/orders",
      stockIcon: "fi fi-rr-shopping-cart",
      fillIcon: "fi fi-sr-shopping-cart",
    },
    {
      text: "Products",
      href: "/dashboard/products",
      stockIcon: "fi fi-rr-boxes",
      fillIcon: "fi fi-sr-boxes",
    },
    {
      text: "Customers",
      href: "/dashboard/customers",
      stockIcon: "fi fi-rr-user-bag",
      fillIcon: "fi fi-sr-user-bag",
    },
  ];

  return (
    <>
      {isDashboard ? (
        <nav className="sticky top-0 z-50 mx-space-8 my-space-7 rounded-full bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#1E1B4B] border border-secondary/5 flex items-center justify-between px-space-11 py-space-3">
          <Link href={"/"}>
            <Image
              width={1000}
              height={1000}
              alt="logo"
              src={assets.logo}
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-space-3 w-fit">
            {dashboardNavItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="text-red font-medium"
          >
            Logout
          </button>
        </nav>
      ) : (
        <nav className="sticky top-0 z-50 mx-space-8 my-space-7 rounded-full bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#1E1B4B] border border-secondary/5 flex items-center justify-between px-space-11 py-space-3">
          <Link href={"/"}>
            <Image
              width={1000}
              height={1000}
              alt="logo"
              src={assets.logo}
              className="h-10 w-auto"
            />
          </Link>

          <Navbar_Searchbar />

          <div className="flex items-center gap-space-5">
            <Link href={"/wishlist"}>
              <button className="bg-secondary text-background p-space-4 rounded-lg w-[48px] h-[48px] relative">
                <div className="absolute top-0 right-0 w-[16px] h-[16px] bg-background text-foreground flex items-center justify-center rounded-sm">
                  <label
                    htmlFor="wishlist"
                    className="text-[8px] font-primary font-medium leading-none"
                  >
                    {wishlistCount}
                  </label>
                </div>
                <i className="fi fi-rr-wishlist-heart flex items-center justify-center text-[20px]"></i>
              </button>
            </Link>

            <Link href={"/my_orders"}>
              <button className="bg-secondary text-background p-space-4 rounded-lg w-[48px] h-[48px]">
                <i className="fi fi-rr-cart-shopping-fast flex items-center justify-center text-[20px]"></i>
              </button>
            </Link>

            {isLoggedIn ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-1.5"
                  aria-label="Account menu"
                >
                  <Image
                    alt="profile"
                    src={customer.image?.url || "/placeholder-avatar.png"}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <i
                    className={`fi fi-rr-caret-down text-secondary text-sm transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 z-40">
                    <ProfileCard onClose={() => setProfileOpen(false)} />
                  </div>
                )}
              </div>
            ) : (
              <Link href={"/login"}>
                <button className="font-primary text-size-h6 text-secondary font-semibold">
                  Login
                </button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
