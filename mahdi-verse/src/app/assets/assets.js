import Behance from "./Behance.svg";
import Dribbble from "./Dribbble.svg";
import Facebook from "./Facebook.svg";
import Whats_App from "./Whats_App.svg";
import Linkedin from "./Linkedin.svg";
import Github from "./Github.svg";
import Twitter from "./Twitter.svg";
import Gmail from "./Gmail.svg";
import profile from "./profile.png";
import about from "./about.png";
import Visual_Studio_Code from "./Visual_Studio_Code.svg";
import React_js from "./React_js.svg";
import nextjs from "./nextjs.svg";
import figma from "./figma.svg";
import Node_js from "./Node_JS.svg";
import redux from "./redux.svg";
import CheckBox from "./CheckBox.svg";
import backgroundImage from "./backgroundImage.jpg";
import CheckBox_L from "./CheckBox_L.svg";
import CheckBox_D from "./CheckBox_D.svg";

// tools
import figma1 from "./Figma1.svg";
import illustrator from "./illustrator.svg";
import photoshop from "./photoshop.svg";

export const assets = {
  profile,
  Visual_Studio_Code,
  React_js,
  nextjs,
  figma,
  Node_js,
  redux,
  CheckBox,
  CheckBox_L,
  CheckBox_D,
  about,
  backgroundImage,
};

export const tools = {
  figma1,
  illustrator,
  photoshop,
  nextjs,
};

export const socialAssets = {
  Behance,
  Dribbble,
  Gmail,
  Facebook,
  Linkedin,
  Github,
  Twitter,
  Whats_App,
};

export const UIUXWorkflow = [
  {
    id: 1,
    phaseNumber: "01",
    phaseLabel: "PHASE 01",
    icon: "fi fi-rr-search-alt",
    title: "Research & Discovery",
    tagline: "Skip this, and you’re paying to build on guesses.",
    description:
      "Most websites fail because they’re built on assumptions about customers, not facts. I study your business, audience and competitors first, so every design decision has a reason behind it, and you start ahead of competitors who guessed.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Stakeholder Discussions",
        description:
          "Unclear expectations lead to endless revisions. A focused kickoff puts your vision, budget and deadlines on paper from day one.",
      },
      {
        id: 2,
        number: "02",
        title: "Business Goals Analysis",
        description:
          "A site without goals looks nice and sells nothing. I turn your goals into measurable targets like leads, sign-ups or sales.",
      },
      {
        id: 3,
        number: "03",
        title: "User Research",
        description:
          "Designing for “everyone” converts no one. Interviews and surveys show what your customers need and what makes them leave.",
      },
      {
        id: 4,
        number: "04",
        title: "Competitor Analysis",
        description:
          "Copy your competitors and you blend in. I study what they do well and badly to find the gap only you can fill.",
      },
      {
        id: 5,
        number: "05",
        title: "Market Research",
        description:
          "An outdated look signals an outdated business. I check industry trends and customer expectations so your site feels current.",
      },
      {
        id: 6,
        number: "06",
        title: "Project Requirements",
        description:
          "Vague scope brings surprise costs and delays. I define pages, features and technical needs up front, so there are no surprises later.",
      },
    ],
  },
  {
    id: 2,
    phaseNumber: "02",
    phaseLabel: "PHASE 02",
    icon: "fi fi-rr-location-crosshairs",
    title: "Define & Strategy",
    tagline: "Without a plan, every page pulls in a different direction.",
    description:
      "Research only helps if it turns into decisions. I boil everything down to one clear problem statement and a strategy, so the whole design pulls in one direction: toward your goals.",
    points: [
      {
        id: 1,
        number: "01",
        title: "User Personas",
        description:
          "If you don’t know who you’re talking to, you can’t persuade them. Personas keep every screen focused on a real person’s goals.",
      },
      {
        id: 2,
        number: "02",
        title: "User Journey Mapping",
        description:
          "Visitors rarely leave without a reason. I map their path from first click to purchase and find exactly where they drop off.",
      },
      {
        id: 3,
        number: "03",
        title: "Problem Statement",
        description:
          "Solving the wrong problem is the most expensive mistake. One sharp sentence keeps the whole project on target.",
      },
      {
        id: 4,
        number: "04",
        title: "Information Architecture",
        description:
          "If people can’t find it, it doesn’t exist. I structure your pages and content so everything is where visitors expect it.",
      },
      {
        id: 5,
        number: "05",
        title: "Design Strategy",
        description:
          "Design without principles turns into opinion battles. I set the approach and success metrics so decisions are made on evidence.",
      },
      {
        id: 6,
        number: "06",
        title: "Feature Prioritization",
        description:
          "Too many features slow the launch and confuse users. I rank them by user value and business impact, so the important ones ship first.",
      },
    ],
  },
  {
    id: 3,
    phaseNumber: "03",
    phaseLabel: "PHASE 03",
    icon: "fi fi-rr-layout-fluid",
    title: "Ideation & Wireframing",
    tagline: "Fixing a layout on paper takes minutes. Fixing it in code takes days.",
    description:
      "Before any colors or fonts, I explore several ideas and shape the strongest into simple wireframes. You see and approve the structure while changes are still cheap and fast.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Sketching & Brainstorming",
        description:
          "The first idea is rarely the best one. I explore multiple concepts quickly and keep the strongest.",
      },
      {
        id: 2,
        number: "02",
        title: "User Flows",
        description:
          "Every extra step costs you customers. I map the shortest path for key tasks like booking, buying or contacting you.",
      },
      {
        id: 3,
        number: "03",
        title: "Low-Fidelity Wireframes",
        description:
          "Colors hide structural problems. Plain grey wireframes show layout and hierarchy problems while they’re easy to fix.",
      },
      {
        id: 4,
        number: "04",
        title: "Content Layout",
        description:
          "Walls of text and buried buttons lose visitors. I arrange content so the most important thing is seen first.",
      },
      {
        id: 5,
        number: "05",
        title: "Navigation Design",
        description:
          "Confusing menus are the quickest way to lose a visitor. I design navigation that feels obvious on phone and desktop.",
      },
      {
        id: 6,
        number: "06",
        title: "Feedback & Approval",
        description:
          "Surprises after design are expensive. You review the wireframes, and I refine them before any visual design starts.",
      },
    ],
  },
  {
    id: 4,
    phaseNumber: "04",
    phaseLabel: "PHASE 04",
    icon: "fi fi-rr-website-design",
    title: "UI Design & Prototyping",
    tagline: "A cluttered, inconsistent design makes visitors doubt your business.",
    description:
      "I turn the approved structure into polished high-fidelity screens in Figma, then link them into a clickable prototype. You can click through your website before a single line of code is written.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Visual Design System",
        description:
          "Random styles make a brand look amateur. A defined set of colors, type scale and spacing keeps everything consistent and easy to update later.",
      },
      {
        id: 2,
        number: "02",
        title: "High-Fidelity Mockups",
        description:
          "Designing only the happy path leaves gaps. I design hover, error, empty and loading states too, so nothing is improvised later.",
      },
      {
        id: 3,
        number: "03",
        title: "Interaction Design",
        description:
          "Static sites feel lifeless. Subtle micro-interactions give feedback and guide attention without slowing the page.",
      },
      {
        id: 4,
        number: "04",
        title: "Responsive Design",
        description:
          "Most of your visitors are on phones. I design mobile-first, then scale up to tablet and desktop.",
      },
      {
        id: 5,
        number: "05",
        title: "Interactive Prototyping",
        description:
          "Static images can’t show how a site feels. A clickable prototype lets you and real users try the flow before development.",
      },
      {
        id: 6,
        number: "06",
        title: "Accessibility & Consistency Check",
        description:
          "Low contrast and tiny text push people away. I check contrast, text sizes and touch targets across every screen and state.",
      },
    ],
  },
  {
    id: 5,
    phaseNumber: "05",
    phaseLabel: "PHASE 05",
    icon: "fi fi-rr-web-test",
    title: "Usability Testing & Validation",
    tagline: "A design only you have approved is still a guess.",
    description:
      "I put the prototype in front of real users and watch where they hesitate, misclick or get lost. Every problem found goes back into the design, gets fixed, and is tested again, so your visitors never find the flaws before we do.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Test Planning",
        description:
          "Random testing gives random answers. I define goals, tasks and the right participants before the first session.",
      },
      {
        id: 2,
        number: "02",
        title: "Usability Testing",
        description:
          "Opinions lie, behavior doesn’t. I watch real users complete real tasks and note every moment of friction.",
      },
      {
        id: 3,
        number: "03",
        title: "A/B Testing",
        description:
          "Not sure which version converts better? I compare variations, so the winner is chosen by results, not taste.",
      },
      {
        id: 4,
        number: "04",
        title: "Feedback Analysis",
        description:
          "Not every problem is equally serious. I rank issues by severity so the ones hurting conversions are fixed first.",
      },
      {
        id: 5,
        number: "05",
        title: "Update the Design",
        description:
          "Found a problem? The design gets updated right away. Nothing is postponed to “after launch”.",
      },
      {
        id: 6,
        number: "06",
        title: "Re-test & Accessibility Review",
        description:
          "A fix isn’t finished until it’s proven. I test again until the problem is gone and the design meets accessibility best practices.",
      },
    ],
  },
  {
    id: 6,
    phaseNumber: "06",
    phaseLabel: "PHASE 06",
    icon: "fi fi-rr-clip-file",
    title: "Development Handoff",
    tagline: "Designs usually get lost in translation here. Not with me.",
    description:
      "On most projects the designer and developer are two different people, and details are lost in the handoff. I design and build it myself, so the final website matches the approved design, not a rough copy of it.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Design Documentation",
        description:
          "Undocumented decisions get forgotten. Specs and design rationale are written down for you and for future updates.",
      },
      {
        id: 2,
        number: "02",
        title: "Asset Preparation",
        description:
          "Heavy images slow your site. I export optimized icons, SVGs and modern image formats, ready for fast loading.",
      },
      {
        id: 3,
        number: "03",
        title: "Design-to-Code Alignment",
        description:
          "No hand-off gap and no “that’s not what I designed”. The person who made the design is the person who builds it.",
      },
      {
        id: 4,
        number: "04",
        title: "Component Handoff",
        description:
          "Rebuilding the same button ten times wastes budget. Design components map directly to reusable code components.",
      },
      {
        id: 5,
        number: "05",
        title: "QA & Design Review",
        description:
          "Small spacing and color drifts add up. I compare the built pages against the design, screen by screen.",
      },
      {
        id: 6,
        number: "06",
        title: "Final Adjustments",
        description:
          "Real browsers always reveal surprises. I make last refinements so the design holds up on real devices.",
      },
    ],
  },
  {
    id: 7,
    phaseNumber: "07",
    phaseLabel: "PHASE 07",
    icon: "fi fi-rr-browser",
    title: "Launch & Post-Launch Support",
    tagline: "Launch day is the starting line, not the finish.",
    description:
      "Most people disappear after launch and leave you to figure out what’s working. I keep watching real behavior and keep improving, so your website gets better while competitors’ sites stay the same.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Launch Monitoring",
        description:
          "Problems are cheapest to fix in the first hours. I track performance and behavior right after launch.",
      },
      {
        id: 2,
        number: "02",
        title: "Analytics Review",
        description:
          "Without data you’re flying blind. I measure results against the goals we set in Phase 01.",
      },
      {
        id: 3,
        number: "03",
        title: "User Feedback Collection",
        description:
          "Your customers will tell you what’s wrong if you ask. I gather ongoing feedback from real users.",
      },
      {
        id: 4,
        number: "04",
        title: "Continuous Improvement",
        description:
          "A site that never changes falls behind. I iterate on the design based on data and feedback.",
      },
      {
        id: 5,
        number: "05",
        title: "Performance Optimization",
        description:
          "Small usability wins compound into more leads. I keep improving the experience over time.",
      },
      {
        id: 6,
        number: "06",
        title: "Documentation & Reporting",
        description:
          "You deserve to know what worked. I summarize outcomes and recommend what’s actually worth doing next.",
      },
    ],
  },
];

export const MERNStackWorkflow = [
  {
    id: 1,
    phaseNumber: "01",
    phaseLabel: "PHASE 01",
    icon: "fi fi-rr-search-alt",
    title: "Requirement Analysis & Planning",
    tagline: "Code written without a plan becomes code you pay to rewrite.",
    description:
      "Skipping planning is how projects blow past budgets and deadlines. I map features, data and architecture before writing a line of code, so you get a scalable app instead of a patchwork.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Requirement Gathering",
        description:
          "Misunderstood features mean rebuilding later. I write clear user stories with acceptance criteria, so “done” means the same to both of us.",
      },
      {
        id: 2,
        number: "02",
        title: "Tech Stack Planning",
        description:
          "The wrong tools limit growth. I choose MongoDB, Express, React/Next.js and Node.js for what your project needs, not what’s trendy.",
      },
      {
        id: 3,
        number: "03",
        title: "Database Schema Design",
        description:
          "A poorly designed database slows down everything built on top of it. I model collections and relationships carefully first.",
      },
      {
        id: 4,
        number: "04",
        title: "API Planning",
        description:
          "Frontend and backend that disagree cause bugs. I define endpoints and data formats up front as a contract both sides follow.",
      },
      {
        id: 5,
        number: "05",
        title: "Wireframe & UI Reference",
        description:
          "Building from memory leads to “that’s not what we agreed”. I build from the approved Figma design.",
      },
      {
        id: 6,
        number: "06",
        title: "Project Timeline",
        description:
          "Not knowing progress is stressful. Work is split into milestones, so you always see what’s done and what’s next.",
      },
    ],
  },
  {
    id: 2,
    phaseNumber: "02",
    phaseLabel: "PHASE 02",
    icon: "fi fi-rr-master-plan",
    title: "Project Setup & Architecture",
    tagline: "A messy foundation makes every future update slower and costlier.",
    description:
      "I set up the environment, folder structure and core configuration the way professional teams do. A clean base means faster features now and easy changes years later, even by another developer.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Repository Setup",
        description:
          "Lost code and overwritten work are painful. Git with a clear branching strategy keeps every change tracked and reversible.",
      },
      {
        id: 2,
        number: "02",
        title: "Folder Structure",
        description:
          "Tangled files make bugs hard to find. Client and server are organized by feature, so everything has an obvious place.",
      },
      {
        id: 3,
        number: "03",
        title: "Environment Configuration",
        description:
          "Leaked passwords can sink a business. Secrets live in environment variables and never in the code.",
      },
      {
        id: 4,
        number: "04",
        title: "Package Installation",
        description:
          "Unnecessary packages bloat your site. I install only what’s needed, plus ESLint and Prettier to keep the code clean and consistent.",
      },
      {
        id: 5,
        number: "05",
        title: "Database Connection",
        description:
          "A dropped connection takes the whole site down. MongoDB connects via Mongoose with proper error handling and retries.",
      },
      {
        id: 6,
        number: "06",
        title: "Base Server Setup",
        description:
          "Retrofitting structure later is painful. The Express server starts with middleware, routing and error handling already in place.",
      },
    ],
  },
  {
    id: 3,
    phaseNumber: "03",
    phaseLabel: "PHASE 03",
    icon: "fi fi-rr-database-management",
    title: "Backend Development",
    tagline: "A weak backend means slow pages, leaked data, or a site that crashes under traffic.",
    description:
      "I build secure, fast REST APIs and database logic with Node.js, Express and MongoDB. Your data stays protected and your site keeps working as your business grows.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Database Models",
        description:
          "Bad data in means bad results out. Mongoose schemas enforce validation and indexes keep queries fast.",
      },
      {
        id: 2,
        number: "02",
        title: "API Development",
        description:
          "Messy APIs are hard to extend. I build clean REST endpoints with proper status codes and pagination for large data.",
      },
      {
        id: 3,
        number: "03",
        title: "Authentication & Authorization",
        description:
          "Weak login means stolen accounts. Passwords are hashed, sessions use JWT, and role-based access keeps users in their lane.",
      },
      {
        id: 4,
        number: "04",
        title: "",
        description:
          "Open servers invite attacks. Input validation, secure headers, CORS rules and rate limiting protect against abuse and brute force.",
      },
      {
        id: 5,
        number: "05",
        title: "Business Logic",
        description:
          "Logic scattered everywhere breeds bugs. Core rules live in one tested place, so behavior stays predictable.",
      },
      {
        id: 6,
        number: "06",
        title: "API Documentation",
        description:
          "Undocumented APIs are a trap for the next developer. Endpoints are documented in Postman or Swagger.",
      },
    ],
  },
  {
    id: 4,
    phaseNumber: "04",
    phaseLabel: "PHASE 04",
    icon: "fi fi-rr-code-window",
    title: "Frontend Development",
    tagline: "A slow, clunky interface sends visitors straight to your competitor.",
    description:
      "I build responsive, reusable interfaces with React and Next.js. Pages are rendered on the server, so they load fast for visitors and are easy for Google to read.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Component Architecture",
        description:
          "Copy-pasted code makes every change slow. Reusable components mean one fix updates the whole site.",
      },
      {
        id: 2,
        number: "02",
        title: "Routing & Rendering",
        description:
          "Client-only rendering hurts speed and SEO. Next.js App Router with server components sends visitors fast, ready-to-read pages.",
      },
      {
        id: 3,
        number: "03",
        title: "State Management",
        description:
          "Tangled state causes glitchy screens. I use Context or Redux only where it’s needed, to keep the app predictable.",
      },
      {
        id: 4,
        number: "04",
        title: "UI Implementation & Responsiveness",
        description:
          "A design that breaks on phones loses most visitors. I build pixel-accurate, mobile-first layouts that match the Figma file.",
      },
      {
        id: 5,
        number: "05",
        title: "Form Handling & Validation",
        description:
          "Frustrating forms kill leads. Clear validation and helpful error messages make it easy to get in touch or sign up.",
      },
      {
        id: 6,
        number: "06",
        title: "SEO-Ready Foundations",
        description:
          "SEO bolted on afterwards never works as well. Semantic HTML, metadata, sitemap, robots and structured data are built in from the start.",
      },
    ],
  },
  {
    id: 5,
    phaseNumber: "05",
    phaseLabel: "PHASE 05",
    icon: "fi fi-rr-api-cloud",
    title: "API Integration & State Sync",
    tagline: "When frontend and backend don’t talk properly, users see blank screens and stale data.",
    description:
      "I connect the interface to the backend so data flows smoothly, loading and error states are handled gracefully, and users always see up-to-date information.",
    points: [
      {
        id: 1,
        number: "01",
        title: "API Integration",
        description:
          "Broken connections show up as broken features. I wire components to endpoints with Axios or Fetch and verify every flow.",
      },
      {
        id: 2,
        number: "02",
        title: "Data Fetching & Caching",
        description:
          "Re-fetching everything makes pages feel slow. Smart caching shows data instantly and saves server load.",
      },
      {
        id: 3,
        number: "03",
        title: "Error Handling",
        description:
          "Cryptic errors scare customers away. Failures show clear, friendly messages and tell users what to do next.",
      },
      {
        id: 4,
        number: "04",
        title: "Loading & Async States",
        description:
          "Blank screens feel broken. Skeletons and spinners tell users that something is happening.",
      },
      {
        id: 5,
        number: "05",
        title: "Global State Sync",
        description:
          "Stale data causes confusion. Redux or Context is kept in sync with the server, so every screen shows the same truth.",
      },
      {
        id: 6,
        number: "06",
        title: "Real-Time Features",
        description:
          "Where live updates matter, such as chat or notifications, I use WebSockets or Socket.io so users never need to refresh.",
      },
    ],
  },
  {
    id: 6,
    phaseNumber: "06",
    phaseLabel: "PHASE 06",
    icon: "fi fi-rr-web-test",
    title: "Testing & Bug Fixing",
    tagline: "Bugs found by your customers cost you trust. Bugs found by me cost you nothing.",
    description:
      "I test the frontend, backend and the connection between them. Every bug found goes back into the code, gets fixed, and is tested again, so it doesn’t return and nothing else breaks while fixing it.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Unit Testing",
        description:
          "Small bugs hide in small functions. I test components and API functions individually, so the problem is caught at its source.",
      },
      {
        id: 2,
        number: "02",
        title: "Integration Testing",
        description:
          "Parts that work alone can fail together. I test endpoints and data flow end to end.",
      },
      {
        id: 3,
        number: "03",
        title: "Manual QA Testing",
        description:
          "Your customers use all kinds of devices. I test every feature across phones, tablets, desktops and major browsers.",
      },
      {
        id: 4,
        number: "04",
        title: "Edge Cases & Error Handling",
        description:
          "Real users type strange things and lose connection. I test empty, invalid and slow-network situations so the site never breaks.",
      },
      {
        id: 5,
        number: "05",
        title: "Security Testing",
        description:
          "One vulnerability can cost your reputation. I check for XSS, CSRF, injection attacks and exposed data.",
      },
      {
        id: 6,
        number: "06",
        title: "Bug Fixing & Regression Testing",
        description:
          "Found a problem? It gets fixed and updated. Then I re-test the whole flow to make sure the fix didn’t break something else.",
      },
    ],
  },
  {
    id: 7,
    phaseNumber: "07",
    phaseLabel: "PHASE 07",
    icon: "fi fi-rr-bolt",
    title: "Lighthouse Audit & Optimization",
    tagline: "A slow, inaccessible, hard-to-find website quietly loses customers every day.",
    description:
      "Lighthouse scores every site on Performance, Accessibility, Best Practices and SEO. Many sites never even run it. I audit on a production build, fix what drags each score down, and re-test until all four are as high as possible, with a target of 90+ on each. That’s how you get ahead of competitors.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Baseline Audit",
        description:
          "You can’t improve what you don’t measure. I run Lighthouse on mobile and desktop and record the starting scores.",
      },
      {
        id: 2,
        number: "02",
        title: "Performance",
        description:
          "Every extra second of loading loses visitors. I optimize images with next/image, fonts, code splitting and caching, and tune Core Web Vitals (LCP, INP, CLS).",
      },
      {
        id: 3,
        number: "03",
        title: "Accessibility",
        description:
          "Inaccessible sites shut out real customers. I fix contrast, alt text, form labels, keyboard navigation and ARIA, so everyone can use your site.",
      },
      {
        id: 4,
        number: "04",
        title: "Best Practices",
        description:
          "Small technical slips damage trust. I enforce HTTPS, secure headers, zero console errors and up-to-date dependencies.",
      },
      {
        id: 5,
        number: "05",
        title: "SEO",
        description:
          "If Google can’t read it, it can’t rank it. Titles, meta descriptions, canonical URLs, sitemap, robots, structured data and mobile-friendliness are all checked.",
      },
      {
        id: 6,
        number: "06",
        title: "Fix, Re-test & Verify",
        description:
          "One pass isn’t enough. I repeat fix and re-test until scores are high, then add Lighthouse checks so they can’t quietly slip later.",
      },
    ],
  },
  {
    id: 8,
    phaseNumber: "08",
    phaseLabel: "PHASE 08",
    icon: "fi fi-rr-browser",
    title: "Deployment & DevOps",
    tagline: "A launch that goes wrong on day one is hard to recover from.",
    description:
      "I deploy the frontend, backend and database to production and automate the process, so launch day is calm and every future update ships safely.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Environment Setup",
        description:
          "Wrong settings in production cause strange failures. Production variables and secrets are configured and double-checked.",
      },
      {
        id: 2,
        number: "02",
        title: "Backend Deployment",
        description:
          "Servers that sleep or crash lose sales. I deploy the Node/Express API to a reliable host such as Render, AWS or Railway.",
      },
      {
        id: 3,
        number: "03",
        title: "Frontend Deployment",
        description:
          "Slow delivery wastes all our optimization. The Next.js app goes live on Vercel or similar with a global CDN.",
      },
      {
        id: 4,
        number: "04",
        title: "Database Hosting",
        description:
          "Losing your data is the worst case. Production MongoDB on Atlas runs with backups and monitoring.",
      },
      {
        id: 5,
        number: "05",
        title: "CI/CD Pipeline",
        description:
          "Manual deploys invite human error. Build, test and Lighthouse checks run automatically before every release.",
      },
      {
        id: 6,
        number: "06",
        title: "Domain & SSL Setup",
        description:
          "No HTTPS means browser warnings and lost trust. I connect your custom domain with a valid SSL certificate.",
      },
    ],
  },
  {
    id: 9,
    phaseNumber: "09",
    phaseLabel: "PHASE 09",
    icon: "fi fi-rr-it-alt",
    title: "Maintenance & Post-Launch Support",
    tagline: "Websites that aren’t looked after slowly break, slow down and become insecure.",
    description:
      "After launch I keep watching performance, fix issues and improve the app based on real usage. You never have to chase a new freelancer for every update, and I’ll tell you honestly what’s helping or hurting your site.",
    points: [
      {
        id: 1,
        number: "01",
        title: "Performance Monitoring",
        description:
          "Slow-downs are silent. I track uptime, response times and error rates, and re-run Lighthouse to keep scores high.",
      },
      {
        id: 2,
        number: "02",
        title: "Bug Fixes & Patches",
        description:
          "A bug reported after launch shouldn’t sit for weeks. Issues are fixed and re-tested quickly.",
      },
      {
        id: 3,
        number: "03",
        title: "Feature Updates",
        description:
          "Your business will grow. I add new features based on user feedback and what’s worth doing next.",
      },
      {
        id: 4,
        number: "04",
        title: "Security Updates",
        description:
          "Outdated packages are an open door. Dependencies are kept up to date and secure.",
      },
      {
        id: 5,
        number: "05",
        title: "Database Maintenance",
        description:
          "Growing data slows everything down. I optimize queries and indexes and manage database growth.",
      },
      {
        id: 6,
        number: "06",
        title: "Documentation & Handover",
        description:
          "You should never be locked in. Clear documentation lets you or any developer continue the work.",
      },
    ],
  },
];

export const contactPageInfo = {
  title: "Let's Build Something Amazing Together",
  trust: [
    "Expect a response from us within 24 hours",
    "We’re happy to sign an NDA upon request.",
    "Get access to a team of dedicated product specialists.",
  ],
  contact: [
    { icon: "fi fi-rr-envelope", value: "mahdiallmahbub@gmail.com" },
    { icon: "fi fi-rr-phone-flip", value: "+880 17359 99190" },
    { icon: "fi fi-rr-marker", value: "Dhaka, Bangladesh." },
  ],
  socialLinks: [
    {
      icon: Gmail,
      title: "Gmail",
      userName: "mahdiallmahbub@gmail.com",
      color: "#FFFFFF",
      blackText: true,
    },
    {
      icon: Whats_App,
      title: "Whats App",
      userName: "https://wa.me/8801735999190",
      color: "#39AE41",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      userName: "https://www.linkedin.com/in/mahdi-al-mahbub",
      color: "#0073B1",
    },
    {
      icon: Github,
      title: "GitHub",
      userName: "https://github.com/mahdialmahbub",
      color: "#000000",
    },
    {
      icon: Facebook,
      title: "Facebook",
      userName: "https://www.facebook.com/mahdi.al.mahbub.webexpert",
      color: "#0165E1",
    },
    {
      icon: Twitter,
      title: "X",
      userName: "https://x.com/mahdialmahabub",
      color: "#000000",
    },
    {
      icon: Behance,
      title: "Behance",
      userName: "https://www.behance.net/mahdialmahbub",
      color: "#1769FF",
    },
    {
      icon: Dribbble,
      title: "Dribbble",
      userName: "https://www.dribbble.com/mahdialmahbub",
      color: "#E94C88",
    },
  ],
};
