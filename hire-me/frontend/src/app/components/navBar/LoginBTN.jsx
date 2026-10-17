"use client";

import Link from "next/link";

import { Button } from "../Button";
import { useGetMeQuery } from "@/store/api/authApi";

import Avatar from "./Avatar";
import { icons } from "../../../../assets/iconCollection";

const LoginBTN = () => {
  const { data: user, isLoading } = useGetMeQuery();

  // Loading state
  if (isLoading) {
    return (
      <Button
        variant="secondary"
        disabled
        className="bg-neutral-200/10 text-neutral-600"
      >
        <i
          className={`${icons.loading} mr-2 animate-spin`}
          aria-hidden="true"
        />
        Loading...
      </Button>
    );
  }

  // Logged-out state
  if (!user) {
    return (
      <Link href="/login" className="max-md:w-full">
        <Button variant="secondary" className="max-md:w-full">
          Login
        </Button>
      </Link>
    );
  }

  // Logged-in state
  return (
    <div className="group flex items-center gap-space-6 max-md:flex-col max-md:gap-space-5">
      <Link href="/my-resume" className="max-md:w-full">
        <Button variant="secondary" className="max-md:w-full">
          My Resume
        </Button>
      </Link>

      <Link
        href="/profile"
        aria-label={`View profile for ${user.name}`}
        className="flex items-center gap-space-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
      >
        {/* Avatar */}
        <span className="relative flex rounded-full">
          <Avatar
            user={user}
            alt={`${user.name} profile photo`}
            width={48}
            height={48}
            className="size-[48px] rounded-sm"
            priority={true}
          />
          <span
            className="absolute right-0 bottom-0 hidden size-[12px] items-center justify-center rounded-[2px] bg-neutral-50 text-[8px] text-primary-300 md:flex"
            aria-hidden="true"
          >
            <i className={icons.right} />
          </span>
        </span>

        {/* Mobile profile information */}
        <div className="md:hidden">
          <h3 className="mb-0.5 font-primary text-small font-medium">
            {user.name}
          </h3>

          <span className="group/view-profile flex items-center gap-1.5 font-medium text-neutral-500 transition-colors duration-200 group-hover:text-neutral-950">
            View Profile
            <i
              className={`${icons.right} text-body transition-transform duration-200 group-hover/view-profile:translate-x-1`}
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default LoginBTN;
