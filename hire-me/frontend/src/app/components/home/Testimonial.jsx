import React from "react";
import HomeHeader from "./HomeHeader";
import TestimonialCard from "./TestimonialCard";
import { getReviews } from "@/lib/fetchData/review";
import HorizontalScroller from "./HorizontalScroller";

export const testimonials = [
  {
    id: "t1",
    image: "/user-placeholder.jpg",
    name: "Alex Johnson",
    jobTitle: "Frontend Developer",
    rating: 5,
    comment:
      "Creating a professional resume has never been easier! The templates are modern, and the AI suggestions helped me highlight my skills and experience more effectively. I really enjoyed the smooth editing experience.",
    social: "linkedin",
    date: "2026-10-28",
  },
  {
    id: "t2",
    image: "/user-placeholder.jpg",
    name: "Sarah Williams",
    jobTitle: "UI/UX Designer",
    rating: 5,
    comment:
      "I absolutely love this resume builder! The clean interface and beautiful templates made it incredibly easy to create a polished resume. The AI writing assistance was especially helpful in improving my professional summary.",
    social: "facebook",
    date: "2026-10-26",
  },
  {
    id: "t3",
    image: "/user-placeholder.jpg",
    name: "Michael Brown",
    jobTitle: "Software Engineer",
    rating: 4,
    comment:
      "A fantastic tool for building a job-ready resume. I was able to organize my work experience, technical skills, and projects without worrying about formatting. Everything looks professional and well-structured.",
    social: "linkedin",
    date: "2026-10-24",
  },
  {
    id: "t4",
    image: "/user-placeholder.jpg",
    name: "Emily Davis",
    jobTitle: "Digital Marketing Specialist",
    rating: 5,
    comment:
      "The experience was smooth from beginning to end. I especially appreciate the variety of templates and the ability to customize different sections. It saved me so much time compared to creating a resume manually.",
    social: "instagram",
    date: "2026-10-22",
  },
  {
    id: "t5",
    image: "/user-placeholder.jpg",
    name: "Daniel Wilson",
    jobTitle: "Business Analyst",
    rating: 4,
    comment:
      "I was looking for a simple way to create a professional resume, and this platform delivered exactly what I needed. The live preview, customization options, and AI suggestions make the entire process effortless.",
    social: "twitter",
    date: "2026-10-20",
  },
  {
    id: "t6",
    image: "/user-placeholder.jpg",
    name: "Olivia Martinez",
    jobTitle: "Content Writer",
    rating: 5,
    comment:
      "The AI-powered suggestions are a game changer! They helped me improve my descriptions and communicate my experience more clearly. The templates are attractive, modern, and suitable for different career paths.",
    social: "linkedin",
    date: "2026-10-18",
  },
  {
    id: "t7",
    image: "/user-placeholder.jpg",
    name: "James Anderson",
    jobTitle: "Graphic Designer",
    rating: 5,
    comment:
      "Finally, a resume builder that combines simplicity with professional design. I loved how easily I could switch between templates and customize the appearance. The final result looks clean and impressive.",
    social: "facebook",
    date: "2026-10-15",
  },
  {
    id: "t8",
    image: "/user-placeholder.jpg",
    name: "Sophia Taylor",
    jobTitle: "Product Manager",
    rating: 4,
    comment:
      "This platform made updating my resume much easier. The interface is intuitive, the templates are well-designed, and the AI assistance helped me present my achievements in a more impactful way. Highly recommended!",
    social: "instagram",
    date: "2026-10-12",
  },
  {
    id: "t9",
    image: "/user-placeholder.jpg",
    name: "William Thomas",
    jobTitle: "Full Stack Developer",
    rating: 5,
    comment:
      "An excellent resume-building experience! I particularly like the live preview and how quickly changes appear while editing. It is a practical solution for anyone who wants a professional resume without spending hours on design.",
    social: "linkedin",
    date: "2026-10-09",
  },
  {
    id: "t10",
    image: "/user-placeholder.jpg",
    name: "Isabella Moore",
    jobTitle: "HR Executive",
    rating: 4,
    comment:
      "I found this tool extremely helpful for creating a well-organized and visually appealing resume. The editing experience is straightforward, and the AI recommendations make it easier to improve the quality of the content.",
    social: "twitter",
    date: "2026-10-05",
  },
];

const Testimonial = async () => {
  const reviews = await getReviews();

  if (reviews.length === 0)
    return (
      <p className="px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(3rem,calc(7.273vw+0.545rem),6rem)]">
        No reviews yet.
      </p>
    );

  return (
    // Same structure as the Contact section: the section is full width and
    // clips overflow; the width limit lives only on the inner wrappers.
    <section className="w-full overflow-hidden py-[clamp(3rem,calc(7.273vw+0.545rem),6rem)] space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]">
      <div className="px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] min-w-[320px] max-w-300 mx-auto">
        <HomeHeader
          bg={"#D97706"}
          color={"#D97706"}
          name={"Review"}
          title={"Trusted by Thousands of Professionals"}
        />
      </div>
      <div className="pl-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] min-w-[320px] max-w-300 mx-auto">
        <HorizontalScroller
          label="User Reviews"
          className="gap-[clamp(1.125rem,calc(0.909vw+0.943rem),1.625rem)] py-1 min-w-[320px]"
        >
          {testimonials.map((r) => {
            const { id, name, rating, comment, date } = r;

            return (
              <div className="px-1" key={id}>
                <TestimonialCard
                  name={name}
                  rating={rating}
                  comment={comment}
                  date={date}
                />
              </div>
            );
          })}
        </HorizontalScroller>
      </div>
    </section>
  );
};

export default Testimonial;
