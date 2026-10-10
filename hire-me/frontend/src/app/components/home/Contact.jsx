import React from "react";
import HomeHeader from "./HomeHeader";
import ContactCard from "./ContactCard";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { Button } from "../Button";
import Image from "next/image";
import { icons } from "../../../../assets/iconCollection";

const contactInfo = [
  {
    name: "Gmail",
    value: "hireme@gmail.com",
    color: "#FFFFFF",
    icon: icons.Gmail_Contact,
    alt: "Send an email to hireme@gmail.com",
    dark: true,
  },
  {
    name: "Whats App",
    value: "+880 17359 99190",
    color: "#39AE41",
    icon: icons.WhatsApp_Contact,
    alt: "Chat or call the Hire Me team on WhatsApp",
  },
  {
    name: "Facebook",
    value: "hire-me",
    color: "#0165E1",
    icon: icons.Facebook_Contact,
    alt: "Visit the Hire Me Facebook page",
  },
];

const address = "245 Market Street, San Francisco, CA 94105, USA.";

const sectionSpacing =
  "px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(2rem,calc(6.009vw+0.592rem),6rem)]";

const Contact = () => {
  return (
    <>
      {/* ───────── Top: header + contact cards ───────── */}
      <section
        className={`${sectionSpacing} space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]`}
      >
        <HomeHeader
          bg="#0284C7"
          color="#0284C7"
          name="Contact"
          title="Contact Us Anytime"
        />

        <ContactCard />
      </section>

      {/* ───────── Divider ───────── */}
      <div className="flex items-center justify-center gap-space-3 w-full px-4 font-semibold text-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] text-neutral-300">
        <hr className="h-0.5 w-full md:max-w-75 rounded-full border-0 bg-neutral-300" />
        OR
        <hr className="h-0.5 w-full md:max-w-75 rounded-full border-0 bg-neutral-300" />
      </div>

      {/* ───────── Bottom: form + banner ─────────
          Mobile & tablet (< lg): form on top, compact banner below
          Desktop (>= lg): banner on the left (full height), form on the right */}
      <section
        className={`${sectionSpacing} flex flex-col lg:flex-row items-center gap-[clamp(2rem,calc(1.502vw+1.648rem),3rem)] lg:*:flex-1`}
      >
        {/* Form */}
        <div className="w-full lg:order-2">
          <h2 className="mb-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] font-primary font-semibold text-[clamp(1.375rem,calc(0.563vw+1.243rem),1.75rem)]">
            Message us for your needs
          </h2>

          <form action="">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-6">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                labelIcon="fi fi-rr-user"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="yourmail@mail.com"
                labelIcon="fi fi-rr-envelope"
                required
              />

              <Textarea
                label="Message"
                name="message"
                placeholder="I want to make a resume that ..."
                labelIcon="fi fi-rr-comment-dots"
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2 space-y-space-3">
                <Button className="w-full">Send Message</Button>

                <div className="flex items-center justify-center gap-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)]">
                  <p className="font-semibold text-green-300 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)]">
                    Your information is secure
                  </p>
                  <span className="size-1.5 rounded-full bg-neutral-400 max-sm:hidden" />
                  <p className="font-semibold text-neutral-400 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)]">
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Banner */}
        <div className="relative flex flex-col justify-end overflow-hidden rounded-lg lg:order-1 lg:self-stretch lg:min-h-112 p-[clamp(1rem,calc(2.254vw+0.472rem),2.5rem)]">
          <Image
            alt="Contact information background"
            src="/Contact_section_image.jpg"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10">
            {/* Title + text only on desktop */}
            <div className="hidden lg:block mb-[clamp(1.375rem,calc(0.939vw+1.155rem),2rem)]">
              <h2 className="mb-2 font-primary font-semibold text-neutral-50 text-[clamp(1.5rem,calc(1.2vw+1.2rem),2rem)]">
                Contact Us As You Want
              </h2>
              <p className="text-neutral-400 text-[clamp(1rem,calc(0.4vw+0.9rem),1.125rem)]">
                We’re just a message away. Get in touch and we’ll assist you
                with pleasure.
              </p>
            </div>

            {/* Contact chips: stacked on phones, in a row from sm up */}
            <div className="flex flex-wrap max-sm:flex-col gap-space-2">
              {contactInfo.map((item) => (
                <div
                  key={item.name}
                  style={{ "--item-color": item.color }}
                  className="flex items-center gap-3 rounded-lg p-space-3 cursor-pointer transition-all hover:-translate-y-1
                    bg-[color-mix(in_srgb,var(--item-color)_80%,transparent)]
                    hover:bg-[color-mix(in_srgb,var(--item-color)_100%,transparent)]"
                >
                  <Image
                    alt={item.alt}
                    src={item.icon}
                    width={24}
                    height={24}
                    className="size-6 shrink-0"
                  />
                  <div
                    className={`min-w-0 sm:w-30 ${item.dark ? "text-neutral-950" : "text-neutral-50"}`}
                  >
                    <h3 className="font-primary font-semibold text-[12px]">
                      {item.name}
                    </h3>
                    <p className="font-medium text-[10px] text-nowrap opacity-80">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Address */}
            <p className="mt-[clamp(1.375rem,calc(0.939vw+1.155rem),1.5rem)] flex items-start gap-2 text-neutral-400 text-[clamp(1rem,calc(0.376vw+0.912rem),1.25rem)]">
              <i
                className="fi fi-sr-marker mt-1.5 text-sky-500 w-[clamp(1rem,calc(0.188vw+0.956rem),1.125rem)]"
                aria-hidden="true"
              />
              {address}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
