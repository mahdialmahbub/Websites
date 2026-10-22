import React from "react";
import { assets, contactPageInfo } from "../assets/assets";
import Image from "next/image";
import Link from "next/link";
import Form from "../components/contact/Form";
import FadeUp from "../components/motions/FadeUp";
import FadeLeft from "../components/motions/FadeLeft";
import { buildMetadata } from "../utils/buildMetadata";
import JsonLd from "../components/JsonLd";
import { contactPageSchema } from "../utils/schema";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Let’s work together. Reach out for web design, full-stack development, or a free consultation, and let’s bring your idea to life.",
  path: "/contact",
});

const page = () => {
  const { title, trust, contact, socialLinks } =
    contactPageInfo;

  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <section className="min-w-full space-y-space-9">
        {/* form and content */}
        <div className="flex gap-space-7">
          <div className="flex-1">
            <FadeLeft
              as="h1"
              className="font-primary font-semibold text-size-3xl mb-space-6"
            >
              {title}
            </FadeLeft>
            <FadeLeft delay={0.1} className="space-y-4.5 mb-space-7">
              {trust.map((item, i) => (
                <FadeLeft key={i} delay={i * 0.08} className="flex gap-1.5">
                  <Image
                    alt="checked"
                    src={assets.CheckBox_D}
                    width={22}
                    height={22}
                    className="size-5.5 max-h-max mt-0.5"
                  />
                  <h3 className="text-size-md text-placeholder_2 dark:text-placeholder">
                    {item}
                  </h3>
                </FadeLeft>
              ))}
            </FadeLeft>
            <div className="space-y-space-5">
              <FadeLeft
                as="h2"
                delay={0.2}
                className="font-primary font-semibold text-size-lg text-placeholder_2 dark:text-placeholder "
              >
                Contact us with
              </FadeLeft>
              <FadeLeft delay={0.3} className="space-y-space-5">
                {contact.map((item, i) => (
                  <FadeLeft
                    key={i}
                    delay={i * 0.08}
                    className="flex items-center gap-space-2"
                  >
                    <span className="w-[24px] h-[24px] flex items-center justify-center bg-secondary-500/10 rounded-md *:text-[11px] text-secondary-600">
                      <i className={item.icon}></i>
                    </span>
                    <p className="font-medium text-size-base tracking-wide transition-all duration-200">
                      {item.value}
                    </p>
                  </FadeLeft>
                ))}
              </FadeLeft>
            </div>
          </div>

          {/* form */}
          <Form />
        </div>

        {/* Socials */}
        <div className="relative w-full mx-auto rounded-3xl overflow-hidden shadow-xl">
          <Image
            src={assets.backgroundImage}
            alt=""
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div>
              <FadeUp
                as="h2"
                className="text-background text-xl sm:text-2xl font-bold dark:text-foreground"
              >
                Let&apos;s Build Something Amazing Together
              </FadeUp>
              <FadeUp
                as="p"
                delay={0.1}
                className="text-background/70 text-sm mt-1.5 font-medium dark:text-foreground/70"
              >
                Contact us
              </FadeUp>
            </div>

            <div className="grid grid-cols-5 content-center gap-space-5 mt-2 *:w-full *:flex-1">
              {/* Behance case study link */}
              {socialLinks.map((link, i) => (
                <FadeUp key={i} delay={i * 0.05} amount={0}>
                  <Link
                    href={link.userName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center w-full gap-2.5 rounded-lg py-space-3 px-space-4 font-semibold shadow-lg transition-all`}
                    style={{
                      backgroundColor: link.color,
                      color: link.blackText ? "black" : "white",
                    }}
                  >
                    <Image
                      alt={link.title}
                      src={link.icon}
                      width={24}
                      height={24}
                    />
                    <div className="flex min-w-0 flex-1 flex-col items-start">
                      <span className="font-semibold italic tracking-tight text-sm">
                        {link.title}
                      </span>

                      <p className="w-full truncate text-size-xs font-medium text-start">
                        {link.userName}
                      </p>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
