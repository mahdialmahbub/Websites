import React from "react";
import FinalPreview from "./FinalPreview";
import { Button } from "../Button";
import { icons } from "../../../../assets/iconCollection";
import Link from "next/link";
import Image from "next/image";

const FinalPreviewModal = () => {
  return (
    <div className="w-[80%] p-[clamp(1.25rem,calc(3.394vw+0.455rem),3rem)] flex max-md:flex-col gap-[clamp(1.5rem,calc(2.909vw+0.818rem),3rem)] items-center md:*:flex-1">
      <FinalPreview />
      <section className="flex flex-col items-center *:w-full">
        <h1 className="font-primary font-semibold text-[clamp(1.375rem,calc(0.727vw+1.205rem),1.75rem)] mb-[clamp(0.5rem,calc(0.485vw+0.386rem),0.75rem)]">
          Your Resume is Ready
        </h1>
        <p className="text-neutral-500 text-[clamp(0.875rem,calc(0.242vw+0.818rem),1rem)] mb-[clamp(2rem,calc(0.97vw+1.773rem),2.5rem)]">
          Review your completed resume, then share it with employers or download
          a polished copy for your next opportunity.
        </p>
        <div className="flex items-center gap-space-4 max-sm:flex-col *:flex-1 mb-space-4">
          <Button icon={icons.resume}>Download PDF</Button>
          <Button variant="secondary" icon={icons.user}>
            Login
          </Button>
        </div>
        <div className="flex items-center gap-space-0 justify-center text-blue-500 text-body mb-space-8">
          <i className={icons.information}></i>
          <p className="text-[12px] font-medium ml-2">
            Login to securely save oyour resume and update it anytime.
          </p>
        </div>
        {/* share */}
        <div className="flex items-center gap-[clamp(0.5rem,calc(0.606vw+0.358rem),0.8125rem)] mb-[clamp(1rem,calc(0.97vw+0.773rem),1.5rem)]">
          <span className="flex-1 h-px bg-neutral-300/50 rounded-full" />
          <p className="text-[clamp(0.875rem,calc(0.242vw+0.818rem),1rem)] text-neutral-300">
            Share with
          </p>
          <span className="flex-1 h-px bg-neutral-300/50 rounded-full" />
        </div>
        {/* copy link */}
        <div className="flex items-center p-space-2 rounded-lg gap-space-2 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.10),shadow-[0_1px_4px_rgba(0,0,0,0.06)]] mb-space-6 max-w-max">
          <div className="flex items-center gap-2.5 px-space-2 max-w-[300px]">
            <i className={`${icons.link} text-[14px] text-neutral-500`}></i>
            <Link className="text-neutral-500/50 line-clamp-1 w-full" href={"/"}>https://yourresume.com/resume/muraffffffffffffd-naser</Link>
          </div>
          <Button icon={icons.copy} variant="secondary">
            Copy
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-[clamp(0.75rem,calc(1.455vw+0.409rem),1.5rem)] mb-[clamp(1.5rem,calc(1.939vw+1.045rem),2.5rem)]">
          <Button variant="secondary" className="bg-violet-500/5 hover:bg-violet-500/10 text-violet-500" ><Image alt="" src={icons.facebook_violet} />Facehook</Button>
        </div>
        <div className="flex items-center rounded-[12px] bg-green-500/5 gap-space-4 p-space-4">
        <div >
          <h2 className="text-small font-medium text-green-500 mb-1.5">
            Your information is safe and secure
          </h2>
          <p className="text-[12px] text-green-300">
            Your personal information is protected with care. We keep your data private and never share it.
          </p>
        </div>
        </div>
      </section>
    </div>
  );
};

export default FinalPreviewModal;
