import Image from "next/image";
import React from "react";

const TestimonialCard = ({image = "/user-placeholder.jpg", name = "John Doe", jobTitle = "@example", comment = "comment", social = "linkedin", date = "May 10, 2025"}) => {
  return (
    <article className="p-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] space-y-[clamp(0.875rem,calc(0.939vw+0.655rem),1.5rem)] rounded-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] border border-orange-500/20 shadow-[1px_1px_6px_rgb(217_119_6/0.25)] hover:shadow-[4px_4px_0px_rgb(217_119_6/0.50)] transition-shadow duration-150 w-[clamp(18.75rem,calc(14.085vw+15.449rem),28.125rem)]">
        <div className="flex items-center gap-[clamp(0.5rem,calc(0.188vw+0.456rem),0.625rem)]">
            <Image alt="User image who review our resume product" src={image || "/user-placeholder.jpg"} width={44} height={44} className="size-[clamp(1.75rem,calc(1.502vw+1.398rem),2.75rem)] rounded-full"/>
            <div className="">
                <h4 className="text-[clamp(0.625rem,calc(0.563vw+0.493rem),1rem)] font-primary font-medium w-full">
                    {name}
                </h4>
                <p className="text-[clamp(0.625rem,calc(0.563vw+0.493rem),1rem)] text-neutral-400">
                    {jobTitle}
                </p>
            </div>
            
        </div>
        <h5 className="text-neutral-900">{comment}</h5>

        {/* social and date */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[clamp(0.75rem,calc(0.282vw+0.684rem),0.9375rem)] text-neutral-400">
                Posted on

                {social && <div className="flex items-center gap-space-1 text-[12px] text-neutral-800">
                    {social == "facebook" && <i className="fi fi-brands-facebook"></i>}
                    {social == "instagram" && <i className="fi fi-brands-instagram-circle"></i>}
                    {social == "twitter" && <i className="fi fi-brands-twitter-alt-circle"></i>}
                    {social == "linkedin" && <i className="fi fi-brands-linkedin-circle"></i>}
                </div>}
            </div>
            <p className="text-[clamp(0.625rem,calc(0.282vw+0.559rem),0.8125rem)] text-neutral-400">
                {date}
            </p>
        </div>
    </article>
  );
};

export default TestimonialCard;
