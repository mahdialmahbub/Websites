import React from "react";
import SectionHeader from "../SectionHeader";
import FaqAccordion from "./FaqAccordion";
import { Faqs } from "@/app/assets/assets";

const FAQ = () => {
  return (
    <section className="section">
      <SectionHeader type="withSubtitle"
        title={"Got Questions? We’ve Got Answers"}
        subtitle={"Everything you need to know before hitting the road."}
      />
      <div className="flex flex-col items-center gap-space-5">
        {Faqs.map((faq, index) => (
          <FaqAccordion key={index} ques={faq.question} ans={faq.answer} />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
