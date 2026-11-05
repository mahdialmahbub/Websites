"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";

const SocialIcon = ({ social }) => {
  if (!social) return null;

  return (
    <div className="flex items-center text-[12px] text-neutral-800">
      {social === "facebook" && <i className="fi fi-brands-facebook" />}
      {social === "instagram" && (
        <i className="fi fi-brands-instagram-circle" />
      )}
      {social === "twitter" && <i className="fi fi-brands-twitter-alt-circle" />}
      {social === "linkedin" && <i className="fi fi-brands-linkedin-circle" />}
    </div>
  );
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const TestimonialCard = ({
  image = "/user-placeholder.jpg",
  name = "John Doe",
  jobTitle = "@example",
  comment = "comment",
  social = "linkedin",
  date = "May 10, 2025",
}) => {
  const [open, setOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const commentRef = useRef(null);

  // Comment 3 line er beshi hole truncated = true
  useEffect(() => {
    const el = commentRef.current;
    if (!el) return;

    const check = () => setIsTruncated(el.scrollHeight > el.clientHeight + 1);

    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => observer.disconnect();
  }, [comment]);

  return (
    <>
      <article className="bg-white p-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] space-y-[clamp(0.875rem,calc(0.939vw+0.655rem),1.5rem)] rounded-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] border border-orange-500/20 shadow-[1px_1px_6px_rgb(217_119_6/0.25)] hover:shadow-[4px_4px_0px_rgb(217_119_6/0.50)] transition-shadow duration-150 w-[clamp(18.75rem,calc(14.085vw+15.449rem),28.125rem)]">
        <div className="flex items-center gap-[clamp(0.5rem,calc(0.188vw+0.456rem),0.625rem)]">
          <Image
            alt="User image who review our resume product"
            src={image || "/user-placeholder.jpg"}
            width={44}
            height={44}
            className="size-[clamp(1.75rem,calc(1.502vw+1.398rem),2.75rem)] rounded-full"
          />
          <div>
            <h4 className="text-[clamp(0.625rem,calc(0.563vw+0.493rem),1rem)] font-primary font-medium w-full">
              {name}
            </h4>
            <p className="text-[clamp(0.625rem,calc(0.563vw+0.493rem),1rem)] text-neutral-400">
              {jobTitle}
            </p>
          </div>
        </div>

        <div className="relative">
  <p ref={commentRef} className="text-neutral-900 line-clamp-3">
    {comment}
  </p>

  {isTruncated && (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      className="absolute bottom-0 right-0 bg-linear-to-l from-white from-75% to-transparent pl-8 font-medium text-orange-600 hover:underline focus-visible:underline"
    >
      … See more
    </button>
  )}
</div>

        {/* social and date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[clamp(0.75rem,calc(0.282vw+0.684rem),0.9375rem)] text-neutral-400">
            Posted on
            <SocialIcon social={social} />
          </div>
          <time
            dateTime={date}
            className="text-[clamp(0.625rem,calc(0.282vw+0.559rem),0.8125rem)] text-neutral-400"
          >
            {formatDate(date)}
          </time>
        </div>
      </article>

      <Modal open={open} onClose={() => setOpen(false)} title="Customer review">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Image
              alt={`${name}'s profile photo`}
              src={image || "/user-placeholder.jpg"}
              width={42}
              height={42}
              className="size-[42px] rounded-full"
            />
            <div className="-space-y-0.5">
              <h3 className="font-primary text-[16px] font-medium">{name}</h3>
              <p className="text-neutral-400 text-[14px]">{jobTitle}</p>
            </div>
          </div>

          <p className="whitespace-pre-line break-words text-neutral-900">
            {comment}
          </p>

          <div className="flex items-center justify-between border-t border-neutral-500/10 pt-4">
            <div className="flex items-center gap-1.5 text-sm text-neutral-400">
              Posted on
              <SocialIcon social={social} />
            </div>
            <time dateTime={date} className="text-sm text-neutral-400">
              {formatDate(date)}
            </time>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TestimonialCard;