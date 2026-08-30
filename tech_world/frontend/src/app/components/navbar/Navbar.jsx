"use client";

import { assets } from "@/app/assets/assets";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar_Searchbar from "./Navbar_Searchbar";
import NavItem from "../dashboard/NavItem";
import Link from "next/link";
import ProfileCard from "../ProfileCard";
import {
  useGetMyProfileQuery,
  useAdminLogoutMutation,
  useGetMyWishlistQuery,
} from "@/redux";

const DASHBOARD_NAV_ITEMS = [
  {
    text: "Dashboard",
    href: "/dashboard",
    stockIcon: "fi fi-rr-dashboard-panel",
    fillIcon: "fi fi-sr-dashboard-panel",
  },
  {
    text: "Orders & Delivery Man",
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

// Shared shell so dashboard/storefront navbars never visually drift apart
const NavShell = ({ children }) => (
  <nav
    className="sticky top-0 z-50 mx-space-8 my-space-7 rounded-full
    bg-[#0F172A]/80 backdrop-blur-md
    bg-linear-to-r from-[#0F172A]/90 via-[#1E293B]/90 to-[#1E1B4B]/90
    border border-secondary/10 shadow-lg shadow-black/20
    flex items-center justify-between px-space-11 py-space-3
    transition-shadow"
  >
    {children}
  </nav>
);

const Logo = () => (
  <Link href={"/"} className="shrink-0">
    <Image
      width={1000}
      height={1000}
      alt="logo"
      src={assets.logo}
      priority
      className="h-10 w-auto"
    />
  </Link>
);

// Small icon-button used for wishlist / cart
const IconButton = ({ href, icon, badge, ariaLabel }) => (
  <Link href={href} aria-label={ariaLabel}>
    <button
      type="button"
      className="relative bg-secondary text-background p-space-4 rounded-lg
      w-[48px] h-[48px] flex items-center justify-center
      transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5
      active:translate-y-0"
    >
      {badge > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
          bg-background text-foreground flex items-center justify-center
          rounded-full border border-secondary/30"
        >
          <span className="text-[10px] font-primary font-semibold leading-none">
            {badge > 99 ? "99+" : badge}
          </span>
        </span>
      )}
      <i className={`fi ${icon} flex items-center justify-center text-[20px]`} />
    </button>
  </Link>
);

const Navbar = ({ isDashboard }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: profileData } = useGetMyProfileQuery(undefined, {
    skip: !!isDashboard,
  });
  const customer = profileData?.data;
  const isLoggedIn = !!customer;

  const { data: wishlistData } = useGetMyWishlistQuery(undefined, {
    skip: !isLoggedIn,
  });
  const wishlistCount = wishlistData?.data?.length || 0;

  const [adminLogout, { isLoading: isLoggingOut }] = useAdminLogoutMutation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
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
    try {
      await adminLogout().unwrap();
    } finally {
      router.push("/admin/login");
    }
  };

  // ── Dashboard navbar ──────────────────────────────────────────────
  if (isDashboard) {
    return (
      <NavShell>
        <Logo />

        <div className="flex items-center gap-space-3 w-fit">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname?.startsWith(item.href)
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdminLogout}
          disabled={isLoggingOut}
          className="text-red font-medium transition-opacity hover:opacity-80
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </NavShell>
    );
  }

  // ── Storefront navbar ─────────────────────────────────────────────
  return (
    <NavShell>
      <Logo />

      <Navbar_Searchbar />

      <div className="flex items-center gap-space-5">
        <IconButton
          href="/wishlist"
          icon="fi-rr-wishlist-heart"
          badge={wishlistCount}
          ariaLabel="Wishlist"
        />

        <IconButton href="/my_orders" icon="fi-rr-cart-shopping-fast" ariaLabel="My orders" />

        {isLoggedIn ? (
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-full p-1 transition-colors
              hover:bg-white/5"
              aria-label="Account menu"
              aria-expanded={profileOpen}
            >
              <Image
                alt="profile"
                src={avatarError ? "/placeholder-avatar.png" : customer.image?.url || "/placeholder-avatar.png"}
                width={36}
                height={36}
                onError={() => setAvatarError(true)}
                className="w-9 h-9 rounded-full object-cover border border-secondary/20"
              />
              <i
                className={`fi fi-rr-caret-down text-secondary text-sm transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-0 top-full mt-3 z-40 origin-top-right
              transition-all duration-150 ${
                profileOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <ProfileCard onClose={() => setProfileOpen(false)} />
            </div>
          </div>
        ) : (
          <Link href={"/login"}>
            <button className="font-primary text-size-h6 text-secondary font-semibold
            transition-opacity hover:opacity-80">
              Login
            </button>
          </Link>
        )}
      </div>
    </NavShell>
  );
};

export default Navbar;