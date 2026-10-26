import React from "react";
import Button from "./components/Button";
import { ErrorPageMarker } from "./components/ErrorPageContext";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <ErrorPageMarker />
      <section className="flex flex-col items-center justify-center min-h-full mt-25">
        <span className="flex items-center gap-x-3.5 text-[90px] font-primary ">
          4<i className="fi fi-rr-not-found-magnifying-glass text-[66px]"></i>4
        </span>
        <h1 className="font-semibold text-size-2xl leading-12.5 -mt-space-3 mb-space-2">
          This page took a different path
        </h1>
        <p className="text-base leading-6.25 text-placeholder_2 dark:text-placeholder text-center mb-5.5">
          The link may be broken, or the page may have moved.
          <br />
          Here’s how to find your way back.
        </p>
        <div className="flex items-center gap-space-4">
          <Link href={"/about"}>
            <Button varient="secondary" text={"About Me"} className="w-50" />
          </Link>
          <Link href={"/projects"}>
            <Button
              text={"View Projects"}
              rightIcon
              icon="fi fi-rr-arrow-small-right"
              className="w-50"
            />
          </Link>
        </div>
      </section>
    </>
  );
};

export default NotFound;
