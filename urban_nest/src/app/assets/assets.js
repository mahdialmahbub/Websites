import logo from "./logo.png";
import HeroImage from "./HeroImage.png";
import Feature_1 from "./Feature_1.jpg";
import Feature_2 from "./Feature_2.jpg";
import Feature_3 from "./Feature_3.jpg";
import Feature_4 from "./Feature_4.jpg";
import Map from "./Map.jpg";

export const assets = {
  logo,
  HeroImage,
  Feature_1,
  Feature_2,
  Feature_3,
  Feature_4,
  Map,
};

export const navbarItems = {
  logo: assets.logo,
  navLinks: [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About Us",
      link: "/about_us",
    },
    {
      name: "Blogs",
      link: "/blogs",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ],
  buttons: { login: "Login", primary: "View Properties" },
};

export const counterItems = [
    { value: "100k+", label: "Happy Clients" },
    { value: "50k+", label: "Properties Sold" },
    { value: "25k+", label: "Expert Agents" },
];

export const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Condo",
  "Townhouse",
  "Penthouse",
  "Duplex",
  "Studio",
  "Office Space",
  "Commercial Property",
  "Land / Plot"
]

export const propertyBudgets = [
  "Under $100K",
  "$100K - $300K",
  "$300K - $500K",
  "$500K - $1M",
  "$1M+",
]

export const propertyProgress = [
  {
    icon: "fi fi-rs-marker",
    label: "Location",
    value: 9.2,
    color: "#2F8CFF",
  },
  {
    icon: "fi fi-rs-home",
    label: "Property",
    value: 8.8,
    color: "#2ECC71",
  },
  {
    icon: "fi fi-rs-bed",
    label: "Bedrooms",
    value: 7.5,
    color: "#8B5CF6",
  },
  {
    icon: "fi fi-rs-bath",
    label: "Bathrooms",
    value: 8.4,
    color: "#F59E0B",
  },
  {
    icon: "fi fi-rs-shield-check",
    label: "Security",
    value: 9.7,
    color: "#EC4899",
  },
];
