/**
 * Profile page er sample data.
 *
 * Keno alada file?
 * Next.js er page.jsx theke default export chara onno kichu (workExperience, education...)
 * export kora jay na — production build e error dey. Tai data ekhane rakha hoyeche.
 * Pore API / DB theke data ashle shudhu ei file replace korlei hobe.
 */

export const profile = {
  name: "Mahdi Al Mahbub",
  title: "UI UX Designer",
  location: "Kaliakoir, Gazipur",
  avatar:
    "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

/**
 * icon  -> ProfileIcon er naam
 * href  -> thakle value ta link hoye jabe (mailto:, tel:, https://)
 * external -> true hole notun tab e khulbe
 */
export const personalInformation = [
  {
    label: "Email",
    value: "mahdialmahmub@gmail.com",
    icon: "mail",
    href: "mailto:mahdialmahmub@gmail.com",
  },
  {
    label: "Phone number",
    value: "+880 17359 99190",
    icon: "phone",
    href: "tel:+8801735999190",
  },
  {
    label: "Location",
    value: "Mouchak, Kaliakoir, Gazipur",
    icon: "mapPin",
  },
  {
    label: "Personal website",
    value: "https://mahdi.com",
    icon: "globe",
    href: "https://mahdi.com",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "https://mahdi.com",
    icon: "linkedin",
    href: "https://mahdi.com",
    external: true,
  },
  {
    label: "GitHub",
    value: "https://mahdi.com",
    icon: "github",
    href: "https://mahdi.com",
    external: true,
  },
];

export const professionalSummary =
  "A creative graphic designer with over 5 years of experience in visual design for digital and print. Proficient in Adobe Creative Suite, with expertise in branding, illustration, and UI design. Possesses a collaborative spirit and a keen eye for executing powerful and effective visual concepts.";

export const skills = ["UIUX designer"];

export const languages = ["English"];

export const workExperience = [
  {
    id: "we-1",
    company: "Pixel & Pine Studio",
    jobTitle: "Frontend Developer",
    employeeType: "Full-time",
    location: "Dhaka, Bangladesh",
    startDate: "2023-09-02",
    endDate: "",
    isCurrent: true, // true hole End Date e "Present" dekhabe
    jobDescription:
      "Next.js diye client dashboard banai ar Figma design ke responsive UI te convert kori.\nRedux Toolkit diye state management ar REST API integration kori.",
  },
  {
    id: "we-2",
    company: "BrightLeaf Tech",
    jobTitle: "Junior UI/UX Designer",
    employeeType: "Internship",
    location: "Remote",
    startDate: "2022-06",
    endDate: "2023-08",
    isCurrent: false,
    jobDescription:
      "User research, wireframe ar prototype toiri kori. Developer der sathe design handoff e kaj kori.",
  },
];

export const education = [
  {
    id: "edu-1",
    institution: "Daffodil International University",
    degree: "B.Sc. in Computer Science & Engineering",
    fieldOfStudy: "Computer Science & Engineering",
    startDate: "2019-01",
    endDate: "2023-03",
    gpa: "3.65 / 4.00",
    description:
      "Web development, HCI ar database systems er upor focus. Final year e MERN stack e thesis project korechi.",
  },
  {
    id: "edu-2",
    institution: "Savar College",
    degree: "Higher Secondary Certificate (HSC)",
    fieldOfStudy: "Science",
    startDate: "2016",
    endDate: "2018",
    gpa: "5.00 / 5.00",
    description: "",
  },
];

export const projects = [
  {
    id: "prj-1",
    projectName: "UrbanNest",
    projectType: "Real Estate Web App",
    role: "UI/UX Designer & Full-stack Developer",
    keyAchievement:
      "Property search flow ke 3 step e niye ashi, jate user der booking time onek kombe.",
    keyResponsibilities:
      "Persona o competitor analysis kora\nWireframe theke high-fidelity prototype banano\nNext.js + MongoDB diye full application develop kora",
    technologies: [
      "Next.js",
      "Redux Toolkit",
      "MongoDB",
      "Express",
      "Node.js",
      "Tailwind CSS",
    ],
    projectUrl: "https://urbannest.example.com",
    description:
      "Ekta real estate platform jekhane user ra property kinte, bikri korte ar filter kore khujte pare.",
  },
  {
    id: "prj-2",
    projectName: "Ledger Payment Demo",
    projectType: "Learning Project",
    role: "Full-stack Developer",
    keyAchievement: "Ek project e 3 ta payment gateway integrate korechi.",
    keyResponsibilities: "Stripe, SSLCommerz ar bKash integration\nWebhook handling",
    technologies: "Next.js, Node.js, Express, MongoDB", // comma separated string-o cholbe
    projectUrl: "github.com/username/ledger-demo", // https:// na thakleo getSafeHref bosiye dibe
    description: "Payment flow shekhar jonno toiri demo project.",
  },
];

export const references = [
  {
    id: "ref-1",
    name: "Rahim Uddin",
    designation: "Senior Engineering Manager",
    company: "Pixel & Pine Studio",
    relationship: "Direct Supervisor",
    email: "rahim.uddin@example.com",
    phone: "+880 1700-000000",
  },
  {
    id: "ref-2",
    name: "Nusrat Jahan",
    designation: "Lecturer",
    company: "Daffodil International University",
    relationship: "Thesis Supervisor",
    email: "nusrat.jahan@example.com",
    phone: "+880 1800-000000",
  },
];
