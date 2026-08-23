"use client";

import { assets } from "@/app/assets/assets";
import Button from "@/app/components/Button";
import InputField from "@/app/components/Input";
import { useAppSelector } from "@/lib/hooks";
import {
  selectPendingTwoFactorEmail,
  useAdminLoginMutation,
  useLoginMutation,
  useVerifyLoginOtpMutation,
} from "@/redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const contactInfo = [
  {
    name: "Gmail",
    value: "example@gmail.com",
    color: "#ffffff",
    icon: assets.Gmail,
    blackText: true,
    link: "www.gmail.com",
  },
  {
    name: "Facebook",
    value: "mahdialmahbub",
    color: "#0165E1",
    icon: assets.Facebook,
    link: "www.facebook.com",
  },
  {
    name: "Gmail",
    value: "+880 17359 99190",
    color: "#39AE41",
    icon: assets.Whats_App,
    link: "www.whatsapp.com",
  },
];

const Page = () => {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [adminLogin, { isLoading, error }] = useAdminLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin({ email, password }).unwrap();
      router.push("/dashboard");
    } catch (err) {
      // error state handled below via `error` from the mutation
    }
  };

  return (
    <section className="min-h-screen min-w-full flex justify-center p-space-11 gap-space-11">
      {/* image and other contact informations */}
      <div className="min-h-full flex-1 p-space-8 rounded-[12px] relative overflow-hidden">
        {/* Background Image */}
        <Image src={assets.overlay1} alt="bg" fill className="object-cover" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* content */}
        <div className="relative z-10 min-h-full flex flex-col items-start justify-between">
          <Button
            showLeftIcon
            leftIcon="fi fi-rr-arrow-small-left"
            variant="text"
            className="text-secondary"
          >
            Back to Home
          </Button>
          <div>
            <h1 className="font-primary font-medium text-[32px] mb-[8px]">
              To get help, Contact us Fluently.
            </h1>
            <p className="font-medium text-size-h5 text-placeholder mt-[18px]">
              Sign in to your account to explore the latest tech and manage your
              orders.
            </p>
            <div className="flex items-center gap-space-3 mt-space-6 mb-space-7">
              {contactInfo.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center p-space-3 gap-2.5 w-[180px] rounded-[8px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  <Image
                    alt={item.name}
                    src={item.icon}
                    height={24}
                    width={24}
                  />
                  <div>
                    <h3
                      className={`font-primary font-semibold text-size-medium ${item.blackText && "text-background"}`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`font-semibold text-size-medium ${item.blackText && "text-background"}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-space-2">
              <i className="fi fi-sr-marker text-secondary text-size-h5"></i>
              <p className="font-medium text-[20px] text-placeholder">
                245 Market Street, San Francisco, CA 94105, USA.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* form */}
      <div
        className="w-[500px] p-space-8 rounded-[12px] border border-secondary/60 flex flex-col items-center justify-center gap-space-8 "
      >
        <div className="w-full text-center">
          <h2 className="font-primary font-medium text-[32px] mb-space-1">
            Welcome Back, Admin
          </h2>
          <p className="font-medium text-size-h6 mb-space-7 text-placeholder_3">
            Sign in to access your dashboard and manage your platform.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-space-4 *:w-full mb-space-6">
              <InputField
                showIcon
                icon="fi fi-sr-envelope"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
              />
              <InputField
                showIcon
                icon="fi fi-rr-password-lock"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error.data?.message || "Invalid credentials."}</p>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </div>

        {/* don't have an account */}
        <span className="flex items-center gap-space-2">
          <p className="font-semibold text-size-h5 text-placeholder_3">
            Don’t Have an Account?
          </p>
          <Button variant="text" className="text-secondary">
            Registration Now
          </Button>
        </span>
      </div>
    </section>
  );
};

export default Page;
