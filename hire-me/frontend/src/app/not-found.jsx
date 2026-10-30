
import React from "react";
import { Button } from "./components/Button";
import Image from "next/image";

// Fluid values: choto value = 375px screen, boro value = 1440px screen (1rem = 16px)
// clamp(min, calc(intercept + slope * vw), max): min shobshomoy choto, max shobshomoy boro.
const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center px-[clamp(2rem,calc(1.5vw+1.65rem),3rem)] py-space-7 gap-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] my-space-6 max-w-205 mx-auto">
      {/* icon and text */}
      <div className="flex items-center flex-col gap-space-2">
        <Image
          alt="This page took a different path. 404 Not found"
          src={"/404-icon.svg"}
          width={200}
          height={200}
          loading="eager"
          className="h-[clamp(7.5rem,calc(7.51vw+5.74rem),12.5rem)] w-auto"
        />

        <div className="text-center space-y-space-3">
          <h1 className="text-[clamp(1.625rem,calc(0.94vw+1.405rem),2.25rem)] font-bold font-primary">
            This page took a different path
          </h1>
          <p className="text-[clamp(1rem,calc(0.376vw+0.912rem),1.25rem)] text-neutral-500">
            The link may be broken, or the page may have moved. Here’s how to
            find your way back.
          </p>
        </div>
      </div>

      {/* Buttons: row parent er full width nibe, button duita equal vag korbe */}
      <div className="flex w-full items-center gap-[clamp(1rem,calc(1.127vw+0.736rem),1.75rem)]">
        <Button variant="secondary" className="flex-1">
          Go Home
        </Button>
        <Button className="flex-1">Create Resume</Button>
      </div>
    </main>
  );
};

export default NotFound;
