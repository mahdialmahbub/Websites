import React from "react";
import HomeHeader from "./HomeHeader";
import ContactCard from "./ContactCard";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { Button } from "../Button";
import Image from "next/image";
import { icons } from "../../../../assets/iconCollection";
import ContactForm from "./ContactForm";
import Link from "next/link";
import { teamInfo } from "../../../../assets/assets";
import HorizontalScroller from "./HorizontalScroller";

const email = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("mahdiallmahbub@gmail.com")}&su=${encodeURIComponent("Project Inquiry")}&body=${encodeURIComponent("I want to make a resume that ...")}`;

const contactInfo = [
  {
    name: "Gmail",
    value: "hireme@gmail.com",
    color: "#FFFFFF",
    icon: icons.Gmail_Contact,
    alt: "Send an email to hireme@gmail.com",
    dark: true,
    link: email,
  },
  {
    name: "Whats App",
    value: "+880 17359 99190",
    color: "#39AE41",
    icon: icons.WhatsApp_Contact,
    alt: "Chat or call the Hire Me team on WhatsApp",
    link: "https://wa.me/+8801735999190",
  },
  {
    name: "Facebook",
    value: "hire-me",
    color: "#0165E1",
    icon: icons.Facebook_Contact,
    alt: "Visit the Hire Me Facebook page",
    link: "https://www.facebook.com/mahdi.al.mahbub.webexpert",
  },
];

const address = "245 Market Street, San Francisco, CA 94105, USA.";

const sectionSpacing =
  "px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(3rem,calc(7.273vw+0.545rem),6rem)]";

const Contact = () => {
  return (
    <>
      {/* ───────── Top: header + contact cards ───────── */}
      <section
        className={` py-[clamp(3rem,calc(7.273vw+0.545rem),6rem)] space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]  overflow-hidden`}
      >
        <div className="px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] min-w-[320px] max-w-300 mx-auto">
          <HomeHeader
            bg="#0284C7"
            color="#0284C7"
            name="Contact"
            title="Contact Us Anytime"
          />
        </div>
        <div className="pl-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] min-w-[320px] max-w-300 mx-auto">
          <HorizontalScroller
            label="Contact Cards"
            className="gap-[clamp(1.125rem,calc(0.909vw+0.943rem),1.625rem)] py-1 min-w-[320px]"
          >
            {teamInfo.map((member) => (
              <ContactCard
                key={member.name}
                image={member.image}
                name={member.name}
                role={member.role}
                phone={member.phone}
                email={member.email}
                address={member.address}
              />
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* ───────── Divider ───────── */}
      <div className="flex items-center justify-center gap-space-3 w-full px-4 font-semibold text-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] text-neutral-300">
        <hr className="h-0.5 w-full md:max-w-75 rounded-full border-0 bg-neutral-100" />
        OR
        <hr className="h-0.5 w-full md:max-w-75 rounded-full border-0 bg-neutral-100" />
      </div>

      {/* ───────── Bottom: form + banner ─────────
          Mobile & tablet (< lg): form on top, compact banner below
          Desktop (>= lg): banner on the left (full height), form on the right */}
      <section
        className={`px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(3rem,calc(7.273vw+0.545rem),6rem)] min-w-[320px] max-w-300 flex flex-col items-stretch gap-[clamp(2rem,calc(1.502vw+1.648rem),3rem)] lg:flex-row`}
      >
        {/* Form */}
        <div className="order-1 w-full min-w-0 lg:order-2 lg:flex-1 lg:flex lg:flex-col lg:justify-center">
          <h2 className="mb-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] font-primary font-semibold text-[clamp(1.375rem,calc(0.563vw+1.243rem),1.75rem)]">
            Message us for your needs
          </h2>

          <ContactForm />
        </div>

        {/* Banner */}
        <div className="order-2 relative flex w-full min-w-0 flex-col justify-end overflow-hidden rounded-lg p-[clamp(1rem,calc(2.254vw+0.472rem),2.5rem)] lg:order-1 lg:flex-1 lg:min-h-112">
          <Image
            alt="Contact information background"
            src="/Contact_section_image.jpg"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10">
            {/* Title + description */}
            <div className="hidden lg:block mb-[clamp(1.375rem,calc(0.939vw+1.155rem),2rem)]">
              <h2 className="mb-2 font-primary font-semibold text-neutral-50 text-[clamp(1.5rem,calc(1.2vw+1.2rem),2rem)]">
                Contact Us As You Want
              </h2>

              <p className="text-neutral-200 text-[clamp(1rem,calc(0.4vw+0.9rem),1.125rem)]">
                We’re just a message away. Get in touch and we’ll assist you
                with pleasure.
              </p>
            </div>

            {/* Contact chips */}
            <div className="flex flex-wrap max-sm:flex-col gap-space-2">
              {contactInfo.map((item) => (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={item.link}
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
                    className="size-6 shrink-0 object-cover"
                  />

                  <div
                    className={`min-w-0 sm:w-30 ${item.dark ? "text-neutral-950" : "text-neutral-50"}`}
                  >
                    <h3 className="font-primary font-semibold text-[clamp(0.75rem,calc(0.227vw+0.705rem),0.875rem)]">
                      {item.name}
                    </h3>

                    <p className="font-medium text-[12px] text-nowrap opacity-80">
                      {item.value}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Address */}
            <p className="mt-[clamp(1.375rem,calc(0.939vw+1.155rem),1.5rem)] flex items-start gap-2 text-neutral-200 text-[clamp(1rem,calc(0.376vw+0.912rem),1.25rem)]">
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
