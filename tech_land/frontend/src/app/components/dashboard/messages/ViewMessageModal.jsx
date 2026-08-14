"use client";

import Link from "next/link";
import React from "react";

const ViewMessageModal = ({
  name = "Mahdi Al Mahbub",
  email = "mahdi@gmail.com",
  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
}) => {
  const handleOpenGmail = () => {
    // Gmail e giye ei address theke/e asha shob mail search kore dekhabe
    const query = encodeURIComponent(`from:${email} OR to:${email}`);
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="p-space-7 rounded-2xl bg-background border-2 border-secondary max-w-[700px]">
      <div className="flex items-center gap-space-3 mb-space-7">
        <i className="text-[32px] fi fi-sr-envelope"></i>
        <h2 className="font-semibold text-size-h3">Verify your email</h2>
      </div>
      <div>
        <div className="mb-space-4 px-space-1 flex items-center justify-between">
          <h3 className="font-primary text-size-h6 font-medium">{name}</h3>
          <Link
            onClick={handleOpenGmail}
            href={"#"}
            className="font-primary text-size-h6 font-semibold text-secondary/80"
          >
            {email}
          </Link>
        </div>
        <p className="font-medium text-size-h6">{message}</p>
      </div>
    </div>
  );
};

export default ViewMessageModal;
