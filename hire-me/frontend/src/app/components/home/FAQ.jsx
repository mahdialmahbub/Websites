import React from 'react'
import FAQCard from '../FAQCard';

export const FAQContent = [
  {
    question: "What is an AI-powered resume builder?",
    answer:
      "Our AI-powered resume builder helps you create a professional, job-ready resume faster. It can improve your resume content, suggest stronger wording, and help organize your experience, skills, projects, and other sections.",
  },
  {
    question: "Can AI improve my existing resume content?",
    answer:
      "Yes. You can use AI to improve your professional summary, work experience, project descriptions, responsibilities, and other resume content. The suggestions are designed to make your writing clearer, stronger, and more professional.",
  },
  {
    question: "Are the resumes ATS-friendly?",
    answer:
      "Yes. Our resume templates use clean layouts and structured content to improve readability for Applicant Tracking Systems (ATS). We also help you present relevant skills and keywords clearly.",
  },
  {
    question: "Can I customize my resume template?",
    answer:
      "Absolutely. You can choose a template that matches your professional style and customize elements such as colors, sections, content, and overall appearance while keeping the layout professional.",
  },
  {
    question: "Can I create a resume without design experience?",
    answer:
      "Yes. You do not need any design skills. Simply enter your information, choose a professional template, and use our guided tools and AI suggestions to build your resume step by step.",
  },
  {
    question: "Can I use the resume for different job applications?",
    answer:
      "Yes. You can create and customize your resume based on different roles or career opportunities. Adjusting your skills, summary, experience, and relevant keywords for each position can make your resume more relevant.",
  },
  {
    question: "Can I download and share my finished resume?",
    answer:
      "Yes. Once your resume is complete, you can generate a polished final version and use it for job applications, online profiles, or sharing with employers.",
  },
];

const FAQ = () => {
  return (
    <section className='flex max-md:flex-col items-center gap-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)] px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(2rem,calc(6.009vw+0.592rem),6rem)] min-w-[320px] max-w-300'>
        {/* FAQ */}
        <div className='space-y-[clamp(1.25rem,calc(1.455vw+0.909rem),2rem)] flex-[60%] max-md:flex-1'>
            {FAQContent.map((item, i) => (
                <FAQCard key={i} answer={item.answer} question={item.question} />
            ))}
        </div>

        {/* Brand Video */}
        <div className='flex-[40%] rounded-[24px] max-md:order-1 max-md:flex-1'>

        </div>
    </section>
  )
}

export default FAQ