"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Button from "./components/Button";
import { ErrorPageMarker } from "./components/ErrorPageContext";

// .tsx hole:
// const ErrorPage = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
const ErrorPage = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <ErrorPageMarker />
      <section className="flex flex-col items-center justify-center min-h-full mt-25">
        <i className="fi fi-rr-triangle-warning text-[90px]"></i>

        <h1 className="font-semibold text-size-2xl leading-12.5 mt-space-2 mb-space-2">
          Something went wrong
        </h1>

        <p className="text-base leading-6.25 text-placeholder_2 dark:text-placeholder text-center mb-5.5">
          An unexpected error occurred on our side.
          <br />
          Please try again, or head back to the projects.
        </p>

        <div className="flex items-center gap-space-4">
          <Button
            onClick={reset}
            varient="secondary"
            text="Try Again"
            className="w-50"
          />
          <Link href="/projects">
            <Button
              text="View Projects"
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

export default ErrorPage;
