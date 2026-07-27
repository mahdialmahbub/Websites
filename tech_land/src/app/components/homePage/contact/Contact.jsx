import React from "react";
import SectionHeader from "../SectionHeader";
import { contactInfo } from "@/app/assets/assets";

const Contact = () => {
  return (
    <section
      className="section relative"
      style={{
        backgroundImage: `url('image.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay */}
      <div class="absolute inset-0 bg-black/50"></div>
      {/* content */}
      <div className="z-10">
        <SectionHeader
          type="withSubtitle"
          subtitle={
            "We’re just a message away. Get in touch and we’ll assist you with pleasure"
          }
          title={"Contact Us"}
        />
        <div className="flex items-center justify-between gap-[46px]">
          {/* contact */}
          <div>
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-center gap-space-6">
                {/* icon */}
                <div className="rounded-full w-[42px] h-[42px] bg-secondary/20 *:text-secondary">
                  <i className={`${item.icon} text-size-h5`}></i>
                </div>
                <h2 className="text-size-h4 text-foreground font-medium">
                  {item.contact}
                </h2>
              </div>
            ))}
          </div>

          {/* form */}
          <div>
            {/* input and textarea */}
            <div className="grid grid-cols-2">
              
            </div>

            {/* button */}
            <div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
