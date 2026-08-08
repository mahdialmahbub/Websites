// projectsData.js
// Array of project objects — .map() kore portfolio er cards/case-study page render korte parbe.
// Tag bar e tag gulor majhe UI te choto circle (·) diye separate kore dekhabe,
// e.g. tags.map((tag, i) => <>{tag}{i < tags.length - 1 && <span className="dot" />}</>)
// const toolsLogo = {
//   Figma1,
//   illustrator,
//   photoshop
// }

import { tools } from "@/app/assets/assets";

export const projectsData = [
  {
    id: "p1",
    slug: "furneistyle-premium-furniture-shopping-experience",

    // ---------- Top tag bar ----------
    category: "UI/UX Design",
    tags: ["UI/UX Design", "Ecommerce platform"],

    // ---------- Basic info ----------
    title: "FurneiStyle – Premium Furniture Shopping Experience",
    description:
      "A modern furniture e-commerce platform focused on creating a seamless shopping experience through intuitive navigation, responsive layouts, and engaging product interactions.",
    caseStudyLink: "#",

    // ---------- Overview ----------
    overview: {
      title: "Project Overview",
      description:
        "Designed and developed a premium furniture marketplace where users can easily browse collections, compare products, and complete purchases with minimal friction.",
    },

    // ---------- Problems & Solutions ----------
    problems: [
      "Users struggled to visualize properties without physically visiting them",
      "Filtering options were too generic to match specific buyer needs",
      "Contacting agents required too many steps, causing drop-offs",
    ],
    solutions: [
      "Added 360° virtual tour integration on every listing page",
      "Introduced advanced filters for budget, amenities, and neighborhood score",
      "Simplified agent contact to a single tap-to-chat button",
    ],

    // ---------- Project Journey ----------
    projectJourneyIntro:
      "Explore the complete design process, from identifying user problems and researching ideas to wireframing, prototyping, and refining the final solution through iterative improvements.",
    projectJourney: [
      {
        icon: "fi fi-rr-search-alt",
        title: "Research",
        subtitle:
          "Interviewed home buyers and agents to map out pain points in the search journey",
        duration: "1 - 4 days",
      },
      {
        icon: "fi fi-rr-search-alt",
        title: "Research",
        subtitle:
          "Explored user flows for property search, comparison, and contact",
        duration: "1 - 4 days",
      },
      {
        icon: "fi fi-rr-search-alt",
        title: "Research",
        subtitle:
          "Built low-fidelity wireframes to test listing layout and filter placement",
        duration: "1 - 4 days",
      },
      {
        icon: "fi fi-rr-search-alt",
        title: "Research",
        subtitle:
          "Defined a warm, trustworthy visual identity suited for real estate",
        duration: "1 - 4 days",
      },
      {
        icon: "fi fi-rr-search-alt",
        title: "Research",
        subtitle:
          "Converted wireframes into detailed UI screens with real listing data",
        duration: "1 - 4 days",
      },
      {
        icon: "fi fi-rr-search-alt",
        title: "Research",
        subtitle:
          "Tested the prototype with users to validate the search and contact flow",
        duration: "1 - 4 days",
      },
    ],

    // ---------- Interactive Features ----------
    interactiveFeatures: [
      "360° virtual property tours",
      "Map-based search with live listing pins",
      "Saved search alerts with instant notifications",
    ],

    // ---------- Colors ----------
    colors: {
      description:
        "A carefully selected color palette that strengthens the brand identity, improves readability, and creates a visually engaging experience while maintaining accessibility and consistency.",
      shades: {
        primary: [
          "#F5F0FB",
          "#E6D9F5",
          "#D3BFF0",
          "#BC9DEA",
          "#A279E3",
          "#8752DB",
          "#6B33C9",
          "#4E1F9E",
          "#2E1160",
        ],
        secondary: [
          "#F0EEFB",
          "#DAD4F7",
          "#C1B6F1",
          "#A392EA",
          "#8368E2",
          "#6041D6",
          "#432AB0",
          "#2C1A80",
          "#180D4D",
        ],
      },
      others: [
        { name: "Placeholder", code: "#000000" },
        { name: "Background", code: "#000000" },
        { name: "Foreground", code: "#000000" },
      ],
    },

    // ---------- Spacing ----------
    spacing: {
      description:
        "A structured spacing system built on consistent alignment, balanced white space, and responsive layouts to ensure clarity, usability, and a seamless experience across devices.",
      scale: [
        { name: "Space-1", value: 4 },
        { name: "Space-2", value: 8 },
        { name: "Space-3", value: 12 },
        { name: "Space-4", value: 14 },
        { name: "Space-5", value: 16 },
        { name: "Space-6", value: 20 },
        { name: "Space-7", value: 28 },
        { name: "Space-8", value: 32 },
        { name: "Space-9", value: 38 },
        { name: "Space-10", value: 64 },
        { name: "Space-11", value: 82 },
        { name: "Space-12", value: 120 },
      ],
    },

    // ---------- Typography ----------
    typographyIntro:
      "A modern typography hierarchy designed to enhance readability, establish visual consistency, and guide users naturally through content with clear headings and body text.",
    typography: [
      {
        fontName: "Roboto",
        usedFor: "Title",
        weights: ["Regular", "Medium", "Semi Bold", "Bold"],
      },
      {
        fontName: "Inter",
        usedFor: "Body",
        weights: ["Regular", "Medium", "Semi Bold", "Bold"],
      },
    ],

    // ---------- Final Design ----------
    finalDesign: {
      description:
        "The polished final interface that brings together research, strategy, and visual design into a cohesive, user-friendly product focused on both functionality and aesthetics.",
      tools: [
        { name: "Figma", logo: tools.figma1 },
        { name: "Illustrator", logo: tools.illustrator },
        { name: "Photoshop", logo: tools.photoshop },
      ],
      // ---------- Header images (thumbnail carousel) ----------
      coverImage: {
        src: "/projects/FurneiStyle/1.jpg",
        alt: "UI Kit Landing Page preview",
      }, // cover image for the project card
      images: [
        {
          src: "/projects/FurneiStyle/1.jpg",
          alt: "UI Kit Landing Page preview",
        },
        {
          src: "/projects/FurneiStyle/2.jpg",
          alt: "Furniture homepage preview",
        },
        { src: "/projects/FurneiStyle/3.jpg", alt: "Product video preview" },
        {
          src: "/projects/FurneiStyle/4.jpg",
          alt: "Furniture catalog preview",
        },
        {
          src: "/projects/FurneiStyle/5.jpg",
          alt: "Furniture catalog preview",
        },
        {
          src: "/projects/FurneiStyle/6.jpg",
          alt: "Furniture catalog preview",
        },
      ],
    },

    // ---------- Client Feedback ----------
    clientIntro:
      "User feedback and project outcomes that highlight improvements in usability, visual appeal, and overall experience, along with key insights that shaped the final design.",
    client: {
      id: "c1",
      Image: "/clientImages/Ahmed_Al-Farsi.jpg",
      name: "Ahmed Al-Farsi",
      position: "First-time Home Buyer",
      feedback: [
        {
          rating: 4.8,
          comment:
            "Finding our new home became so much easier with the virtual tours and smart filters. We saved weeks of searching.",
        },
      ],
    },

    // ---------- What I Learned ----------
    learnings: [
      "Visual context builds buyer confidence faster than text descriptions",
      "Reducing contact friction directly increases agent response rates",
      "Map-based discovery is essential for location-driven decisions",
    ],
  },
];

export default projectsData;
