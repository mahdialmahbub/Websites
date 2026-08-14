import React from "react";
import SearchBar from "../SearchBar";

const SectionHeader = ({ title, subtitle, type = "withBTN" }) => {
  return (
    <>
      {type === "withBTN" && (
        <div className="flex items-center justify-between mb-space-7">
          <h2 className="font-primary text-size-h4 font-semibold">{title}</h2>
          <button className="cursor-pointer flex items-center gap-[4px] text-placeholder_3 hover:text-foreground *:transition-all *:duration-200 ">
            <p htmlFor="" className="text-size-h6 font-primary font-medium">
              View More
            </p>
            <i className="fi fi-rr-arrow-small-right"></i>
          </button>
        </div>
      )}

      {type === "withSubtitle" && (
        <div className="flex flex-col items-center justify-center text-center mb-space-9">
          <h2 className="font-primary text-size-h2 font-semibold">{title}</h2>
          <p className="font-medium text-size-h5 text-placeholder_3">
            {subtitle}
          </p>
        </div>
      )}

      {type === "product" && (
        <div
          className="flex items-center justify-between rounded-[20px] px-space-11 py-space-4"
          style={{
            backgroundImage: `url('image.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h2 className=" font-primary font-semibold text-size-h3 capitalize">
            {title}
          </h2>
          <SearchBar placeholder={"Search for anything tech..."} />
        </div>
      )}
    </>
  );
};

export default SectionHeader;
