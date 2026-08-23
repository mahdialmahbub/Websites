import React from "react";
import SectionHeading from "./SectionHeading";
import Button from "./Button";

const Feature = () => {
  const firstFeatureInfo = {
    title: "Smart Marketing Automation",
    subtitle:
      "Automatically run campaigns, emails, and workflows without manual effort.",
    icon: "fi fi-sr-user-robot",
  };

  const secondFeatureInfo = {
    title: "Real-time Analytics Dashboard",
    subtitle: "Track performance, conversions, and user behavior in real time.",
    icon: "fi fi-sr-chart-pie-alt",
  };

  const thirdFeatureInfo = {
    title: "Easy Integrations",
    subtitle:
      "Connect with your favorite tools like CRM, email, and payment systems.",
    icon: "fi fi-sr-user-link",
  };

  const fourthFeatureInfo = {
    title: "AI-Powered Insights",
    subtitle:
      "Get smart suggestions to improve campaigns and increase conversions.",
    icon: "fi fi-sr-microchip-ai",
  };

  return (
    <div className="section">
      <SectionHeading
        title={"Everything You Need to Automate Your Marketing"}
        subtitle={
          "Powerful tools designed to save your time, boost conversions, and grow your business — all in one place."
        }
        tagName={"Feature"}
      />

      <div className="flex flex-col md:grid grid-cols-2 gap-[16px] md:gap-[16px] xl:gap-[24px]">
        {/* First Feature */}
        <div className="border dark:border-2 rounded-2xl md:rounded-3xl p-[12px] md:p-[24px] xl:p-[32px] dark:bg-black bg-accent1-bg border-accent1/20 dark:border-accent1/80 shadow-[0_0_6px] shadow-accent1 hover:shadow-[0_0_15px] transition-all duration-200">
          {/* ICON */}
          <div className="size-13 md:size-15.5 xl:size-18.5 flex items-center justify-center text-h4 md:text-h3 xl:text-h2 rounded-full text-accent1 bg-accent1/10">
            <i className={`${firstFeatureInfo.icon} inline-flex items-center justify-center`}></i>
          </div>

          {/* CONTENT */}
          <div className="mt-4 space-y-2">
            <h3 className="text-h4 xl:text-h3 font-semibold">
              {firstFeatureInfo.title}
            </h3>
            <p className="text-h6 xl:text-h5 font-medium text-black/70 dark:text-white/70">
              {firstFeatureInfo.subtitle}
            </p>

            <Button variant="text" text="Know more" />
          </div>
        </div>
                {/* Second Feature */}
        <div className="border dark:border-2 rounded-2xl md:rounded-3xl p-[12px] md:p-[24px] xl:p-[32px] dark:bg-black bg-accent2-bg border-accent1/20 dark:border-accent2/80 shadow-[0_0_6px] shadow-accent2 hover:shadow-[0_0_15px] transition-all duration-200">
          {/* ICON */}
          <div className="size-13 md:size-15.5 xl:size-18.5 flex items-center justify-center text-h4 md:text-h3 xl:text-h2 rounded-full text-accent2 bg-accent2/10">
            <i className={`${secondFeatureInfo.icon} inline-flex items-center justify-center`}></i>
          </div>

          {/* CONTENT */}
          <div className="mt-4 space-y-2">
            <h3 className="text-h4 xl:text-h3 font-semibold">
              {secondFeatureInfo.title}
            </h3>
            <p className="text-h6 xl:text-h5 font-medium text-black/70 dark:text-white/70">
              {secondFeatureInfo.subtitle}
            </p>

            <Button variant="text" text="Know more" />
          </div>
        </div>
                {/* Third Feature */}
        <div className="border dark:border-2 rounded-2xl md:rounded-3xl p-[12px] md:p-[24px] xl:p-[32px] dark:bg-black bg-accent4-bg border-accent1/20 dark:border-accent4/80 shadow-[0_0_6px] shadow-accent4 hover:shadow-[0_0_15px] transition-all duration-200">
          {/* ICON */}
          <div className="size-13 md:size-15.5 xl:size-18.5 flex items-center justify-center text-h4 md:text-h3 xl:text-h2 rounded-full text-accent4 bg-accent4/10">
            <i className={`${thirdFeatureInfo.icon} inline-flex items-center justify-center`}></i>
          </div>

          {/* CONTENT */}
          <div className="mt-4 space-y-2">
            <h3 className="text-h4 xl:text-h3 font-semibold">
              {thirdFeatureInfo.title}
            </h3>
            <p className="text-h6 xl:text-h5 font-medium text-black/70 dark:text-white/70">
              {thirdFeatureInfo.subtitle}
            </p>

            <Button variant="text" text="Know more" />
          </div>
        </div>
                {/* Fourth Feature */}
        <div className="border dark:border-2 rounded-2xl md:rounded-3xl p-[12px] md:p-[24px] xl:p-[32px] dark:bg-black bg-accent5-bg border-accent1/20 dark:border-accent5/80 shadow-[0_0_6px] shadow-accent5 hover:shadow-[0_0_15px] transition-all duration-200">
          {/* ICON */}
          <div className="size-13 md:size-15.5 xl:size-18.5 flex items-center justify-center text-h4 md:text-h3 xl:text-h2 rounded-full text-accent5 bg-accent5/10">
            <i className={`${fourthFeatureInfo.icon} inline-flex items-center justify-center`}></i>
          </div>

          {/* CONTENT */}
          <div className="mt-4 space-y-2">
            <h3 className="text-h4 xl:text-h3 font-semibold">
              {fourthFeatureInfo.title}
            </h3>
            <p className="text-h6 xl:text-h5 font-medium text-black/70 dark:text-white/70">
              {fourthFeatureInfo.subtitle}
            </p>

            <Button variant="text" text="Know more" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
