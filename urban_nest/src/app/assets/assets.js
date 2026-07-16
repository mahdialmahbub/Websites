import logo from "./logo.png";
import HeroImage from "./HeroImage.png";
import FinalCTA from "./FinalCTA.jpg";
import Feature_1 from "./Feature_1.jpg";
import Feature_2 from "./Feature_2.jpg";
import Feature_3 from "./Feature_3.jpg";
import Feature_4 from "./Feature_4.jpg";
import Map from "./Map.jpg";
import Aiassistent from "./Aiassistent.jpg";
import Mobileapp from "./Mobileapp.jpg";
import Property_1 from "./Property_1.jpeg";
import Property_2 from "./Property_2.jpeg";
import Property_3 from "./Property_3.jpeg";
import Property_4 from "./Property_4.jpeg";
import Property_5 from "./Property_5.jpeg";
import apple from "./apple.svg";
import google_play from "./google_play.svg";
import Facebook from "./Facebook.svg";
import Instagram from "./Instagram.svg";
import Twitter from "./Twitter.svg";
import Youtube from "./Youtube.svg";
import Linkedin from "./Linkedin.svg";

export const assets = {
  logo,
  HeroImage,
  Feature_1,
  Feature_2,
  Feature_3,
  Feature_4,
  FinalCTA,
  Map,
  Property_1,
  Property_2,
  Property_3,
  Property_4,
  Property_5,
  Mobileapp,
  Aiassistent,
  google_play,
  apple,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
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
  "Land / Plot",
];

export const propertyBudgets = [
  "Under $100K",
  "$100K - $300K",
  "$300K - $500K",
  "$500K - $1M",
  "$1M+",
];

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

export const dummyPropertyInfo = [
  {
    image: {Property_1},
    propertyName: "Sunvale Heights",
    location: "Gulshan-2, Dhaka",
    price: 160000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    showAIRecommended: true,
    showBestChoice: true,
  },
  {
    image: {Property_2},
    propertyName: "Greenwood Residency",
    location: "Banani, Dhaka",
    price: 245000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    showAIRecommended: true,
    showBestChoice: false,
  },
  {
    image: {Property_3},
    propertyName: "Riverside Apartments",
    location: "Uttara Sector 7, Dhaka",
    price: 98000,
    beds: 2,
    baths: 2,
    sqft: 1200,
    showAIRecommended: false,
    showBestChoice: true,
  },
  {
    image: {Property_4},
    propertyName: "Palm Court Villa",
    location: "Dhanmondi, Dhaka",
    price: 320000,
    beds: 5,
    baths: 4,
    sqft: 3500,
    showAIRecommended: true,
    showBestChoice: true,
  },
  {
    image: {Property_5},
    propertyName: "Urban Nest Studio",
    location: "Mirpur DOHS, Dhaka",
    price: 72000,
    beds: 1,
    baths: 1,
    sqft: 750,
    showAIRecommended: false,
    showBestChoice: false,
  },
];
    export const socialIcon = [
        {
            icon: Facebook,
            link: "#"
        },
                {
            icon: Instagram,
            link: "#"
        },
        {
            icon: Twitter,
            link: "#"
        },
        {
            icon: Youtube,
            link: "#"
        },
        {
            icon: Linkedin,
            link: "#"
        },

    ]
