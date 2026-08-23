import React from 'react'
import SectionHeading from './SectionHeading'
import FAQForm from './FAQForm'
import Image from 'next/image';
import { assets } from '../assets/assets';

const FAQ = () => {

    const faqData = [
        {
            ques: "Is there a free trial available??",
            ans: "Yes! You can start with our free trial — no credit card required. Explore all core features and see how GrowthPilot can help your business grow before upgrading."
        },
        {
            ques: "Do I need technical skills to use GrowthPilot??",
            ans: "Not at all. GrowthPilot is designed for non-technical users. With a simple and intuitive interface, you can set up automation and campaigns in just a few clicks."
        },
        {
            ques: "Can I connect my existing tools and platforms?",
            ans: "Absolutely. GrowthPilot integrates with popular tools like email platforms, CRMs, and e-commerce services, so you can manage everything from one place."
        },
        {
            ques: "How does the automation feature work?",
            ans: "You can create workflows based on user actions — for example, sending emails, follow-ups, or offers automatically. Just set it once, and GrowthPilot handles the rest."
        },
        {
            ques: "Can I upgrade or cancel my plan anytime?",
            ans: "Yes, you have full flexibility. You can upgrade, downgrade, or cancel your plan at any time without any hidden fees or long-term commitments."
        },
        {
            ques: "Is my data secure with GrowthPilot?",
            ans: "Your data security is our top priority. We use industry-standard encryption and secure systems to keep your information safe at all times."
        },
    ];

  return (
    <section className='section'>
        <SectionHeading 
        title={"Everything You Need to Automate Your Marketing"}
        subtitle={
          "Powerful tools designed to save your time, boost conversions, and grow your business — all in one place."
        }
        tagName={"FAQ"}
      />
      <div className='w-full flex items-center gap-20'>
        {/* Image */}
        <div className='hidden xl:flex'>
            <Image src={assets.FAQ} alt="FAQ" className='h-95 w-145' />
        </div>
        {/* FAQ Form */}
        <div className='flex flex-col gap-[16px] xl:gap-[20px] w-full'>
            {faqData.map((item, index) => (
                <FAQForm key={index} ques={item.ques} ans={item.ans} />
            ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ