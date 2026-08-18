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
import User from "./User.jpg";
import apple from "./apple.svg";
import google_play from "./google_play.svg";
import Facebook from "./Facebook.svg";
import Instagram from "./Instagram.svg";
import Twitter from "./Twitter.svg";
import Youtube from "./Youtube.svg";
import Linkedin from "./Linkedin.svg";
import Testimonial from "./Testimonial.svg";

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
  User,
  Testimonial,
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
  { value: 100, label: "Happy Clients" },
  { value: 50, label: "Properties Sold" },
  { value: 25, label: "Expert Agents" },
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

export const socialIcons = [
  {
    icon: Facebook,
    link: "#",
  },
  {
    icon: Instagram,
    link: "#",
  },
  {
    icon: Twitter,
    link: "#",
  },
  {
    icon: Youtube,
    link: "#",
  },
  {
    icon: Linkedin,
    link: "#",
  },
];

export const footerItems = {
  quickLinks: [
    { text: "Home", link: "/" },
    { text: "Explore Properties", link: "/explore-properties" },
    { text: "Ai Property Match", link: "/" },
    { text: "Market Insights", link: "/" },
    { text: "Testimonials", link: "/" },
    { text: "About Us", link: "/" },
    { text: "Contact Us", link: "/" },
  ],
  contact: {
    address: "123 Business Avenue, Dhaka 1212, Bangladesh.",
    phone: "+880 1712-345678",
    email: "support@urbanenest.com",
  },
};

// data/properties.js

// প্রতিটা প্রপার্টি অবজেক্টের শেপ (রেফারেন্সের জন্য, কোনো টাইপ চেক হবে না):
// {
//   id: string,
//   name: string,
//   location: string,
//   beds: number,
//   baths: number,
//   sqft: number,
//   price: number,
//   image: string,
//   badges: string[] (optional),
//   overallScore: number,        // 0-100
//   scores: [{ label, value, color }]
// }

export const properties = [
  {
    id: "prop-1",
    name: "Willowbrook Residence",
    location: "Banani, Dhaka",
    lat: 23.7936,
    lng: 90.4066,
    type: "Villa",
    beds: 3,
    baths: 2,
    sqft: 1400,
    price: 160000,
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80", // Property_1 er bodole external URL
    badges: [
      {
        icon: "fi fi-ss-sparkles",
        tag: "AI Recommended",
      },
    ],
    overallScore: 92,
    scores: [
      {
        label: "Safety",
        value: 82,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 90,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 88,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 92,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 90,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-2",
    name: "Gulshan Heights",
    location: "Gulshan, Dhaka",
    lat: 23.7925,
    lng: 90.4078,
    type: "Apartment",
    beds: 4,
    baths: 3,
    sqft: 1850,
    price: 285000,
    image:
      "https://images.unsplash.com/photo-1760473537243-72168ffd273c?w=1200&q=80",
    badges: [
      { icon: "fi fi-ss-sparkles", tag: "AI Recommended" },
      { icon: "fi fi-ss-trophy", tag: "Top Rated" },
    ],
    overallScore: 95,
    scores: [
      {
        label: "Safety",
        value: 94,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 96,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 90,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 93,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 91,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-3",
    name: "Dhanmondi Lake View",
    location: "Dhanmondi, Dhaka",
    lat: 23.7461,
    lng: 90.3742,
    type: "Apartment",
    beds: 3,
    baths: 2,
    sqft: 1550,
    price: 195000,
    image:
      "https://images.unsplash.com/photo-1757125505346-2d71c70e6003?w=1200&q=80",
    badges: [{ icon: "fi fi-ss-badge-check", tag: "Verified" }],
    overallScore: 88,
    scores: [
      {
        label: "Safety",
        value: 85,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 94,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 86,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 87,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 84,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-4",
    name: "Uttara Sky Villa",
    location: "Uttara, Dhaka",
    lat: 23.8759,
    lng: 90.3795,
    type: "Villa",
    beds: 5,
    baths: 4,
    sqft: 2600,
    price: 420000,
    image:
      "https://images.unsplash.com/photo-1758908548763-4b5cd31d1b5a?w=1200&q=80",
    badges: [{ icon: "fi fi-ss-sparkles", tag: "AI Recommended" }],
    overallScore: 91,
    scores: [
      {
        label: "Safety",
        value: 90,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 84,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 92,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 95,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 93,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-6",
    name: "Mohammadpur Garden Duplex",
    location: "Mohammadpur, Dhaka",
    lat: 23.7657,
    lng: 90.3588,
    type: "Duplex",
    beds: 4,
    baths: 3,
    sqft: 2100,
    price: 245000,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    badges: [{ icon: "fi fi-ss-badge-check", tag: "Verified" }],
    overallScore: 83,
    scores: [
      {
        label: "Safety",
        value: 79,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 80,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 84,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 88,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 85,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-7",
    name: "Baridhara Diplomatic Residence",
    location: "Baridhara, Dhaka",
    lat: 23.8103,
    lng: 90.4192,
    type: "Villa",
    beds: 5,
    baths: 5,
    sqft: 3200,
    price: 550000,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    badges: [
      { icon: "fi fi-ss-sparkles", tag: "AI Recommended" },
      { icon: "fi fi-ss-trophy", tag: "Top Rated" },
    ],
    overallScore: 97,
    scores: [
      {
        label: "Safety",
        value: 97,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 95,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 96,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 98,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 96,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-8",
    name: "Lalmatia Cozy Apartment",
    location: "Lalmatia, Dhaka",
    lat: 23.7551,
    lng: 90.3654,
    type: "Apartment",
    beds: 2,
    baths: 2,
    sqft: 1100,
    price: 128000,
    image:
      "https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    badges: [],
    overallScore: 78,
    scores: [
      {
        label: "Safety",
        value: 76,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 82,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 75,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 80,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 77,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-9",
    name: "Mirpur Green Court",
    location: "Mirpur, Dhaka",
    lat: 23.8223,
    lng: 90.3654,
    type: "Apartment",
    beds: 3,
    baths: 2,
    sqft: 1350,
    price: 110000,
    image:
      "https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    badges: [{ icon: "fi fi-ss-badge-check", tag: "Verified" }],
    overallScore: 81,
    scores: [
      {
        label: "Safety",
        value: 80,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 78,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 83,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 84,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 82,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-10",
    name: "Khilgaon Family Home",
    location: "Khilgaon, Dhaka",
    lat: 23.753,
    lng: 90.4256,
    type: "Townhouse",
    beds: 4,
    baths: 3,
    sqft: 1900,
    price: 175000,
    image:
      "https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    badges: [],
    overallScore: 80,
    scores: [
      {
        label: "Safety",
        value: 78,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 79,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 81,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 83,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 80,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
  {
    id: "prop-11",
    name: "Nikunja Penthouse Suite",
    location: "Nikunja, Dhaka",
    lat: 23.8264,
    lng: 90.4127,
    type: "Penthouse",
    beds: 4,
    baths: 4,
    sqft: 2400,
    price: 390000,
    image:
      "https://images.unsplash.com/photo-1708113397538-81a27170f0b8?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    badges: [{ icon: "fi fi-ss-sparkles", tag: "AI Recommended" }],
    overallScore: 93,
    scores: [
      {
        label: "Safety",
        value: 91,
        color: "#3B82F6",
        icon: "fi fi-rs-shield-check",
      },
      {
        label: "Location",
        value: 92,
        color: "#22C55E",
        icon: "fi fi-rs-marker",
      },
      {
        label: "Region",
        value: 94,
        color: "#A855F7",
        icon: "fi fi-rs-bed-alt",
      },
      {
        label: "Kitchen",
        value: 96,
        color: "#F59E0B",
        icon: "fi fi-rs-kitchen-set",
      },
      {
        label: "Bathrooms",
        value: 90,
        color: "#EAB308",
        icon: "fi fi-rs-bath",
      },
    ],
  },
];

// Dummy data for client review cards (structure inspired by the reference design)
// Map over this array in your UI: reviews.map(review => <ReviewCard {...review} />)

export const clientReviews = [
  {
    id: 1,
    quote:
      "Booking was super easy, and the car was spotless and ready right on time. The pickup location was just 5 minutes from my hotel — super convenient!",
    client: {
      name: "Serhiy Hipskyy",
      role: "CEO Universal",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=461&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.5,
    property: {
      name: "Skyline Villa",
      location: "Bangkok, Thailand",
      image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=410&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
      beds: 2,
      baths: 2,
      sqft: 1400,
    },
    aiRecommended: true,
    detailsLink: "#",
  },
  {
    id: 2,
    quote:
      "Check-in was seamless and the villa looked exactly like the photos — even better in person. The host was quick to respond whenever we needed anything.",
    client: {
      name: "Amara Chowdhury",
      role: "Marketing Lead, Nova Retail",
      avatar: "https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 5,
    property: {
      name: "Ocean Breeze Residence",
      location: "Phuket, Thailand",
      image: "https://images.unsplash.com/photo-1708113397538-81a27170f0b8?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
      beds: 3,
      baths: 2,
      sqft: 1650,
    },
    aiRecommended: true,
    detailsLink: "#",
},
{
    id: 3,
    quote:
      "Everything from booking to checkout was smooth. The location was quiet but still close to everything we wanted to see — highly recommend for families.",
    client: {
      name: "Daniel Osei",
      role: "Founder, Osei Consulting",
      avatar: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.8,
    property: {
      name: "Palm Grove Apartment",
      location: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
      beds: 2,
      baths: 1,
      sqft: 980,
    },
    aiRecommended: false,
    detailsLink: "#",
},
{
    id: 4,
    quote:
      "Photos didn't do it justice — the space felt bigger and brighter in person. Communication with the property manager was fast and friendly the whole way through.",
    client: {
      name: "Lucía Fernández",
      role: "Product Designer, Bright Studio",
      avatar: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.9,
    property: {
      name: "Sunset Terrace Villa",
      location: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
      beds: 4,
      baths: 3,
      sqft: 2100,
    },
    aiRecommended: true,
    detailsLink: "#",
},
{
    id: 5,
    quote:
      "We booked last minute and the whole process took less than five minutes. The unit was spotless and had everything we needed for a short stay.",
    client: {
      name: "Michael Tan",
      role: "Operations Manager, LinkWorks",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.5,
    property: {
      name: "Harborview Suites",
      location: "Singapore",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
      beds: 1,
      baths: 1,
      sqft: 720,
    },
    aiRecommended: false,
    detailsLink: "#",
},
{
    id: 6,
    quote:
      "The AI recommendation matched us perfectly — quiet neighborhood, great safety score, and the price was right in our budget. Will book through here again.",
    client: {
      name: "Priya Nair",
      role: "Data Analyst, Finlytics",
      avatar: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 5,
    property: {
      name: "Willow Park Residence",
      location: "Kuala Lumpur, Malaysia",
      image: "https://images.unsplash.com/photo-1758908548763-4b5cd31d1b5a?w=1200&q=80",
      beds: 3,
      baths: 2,
      sqft: 1520,
    },
    aiRecommended: true,
    detailsLink: "#",
},
{
    id: 7,
    quote:
      "Great value for the space you get. A few minor maintenance issues but the host fixed them within the hour, so it didn't ruin the trip at all.",
    client: {
      name: "James Whitfield",
      role: "Sales Director, Meridian Group",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.2,
    property: {
      name: "Cedar Hill Townhouse",
      location: "Chiang Mai, Thailand",
      image: "https://images.unsplash.com/photo-1757125505346-2d71c70e6003?w=1200&q=80",
      beds: 3,
      baths: 3,
      sqft: 1900,
    },
    aiRecommended: false,
    detailsLink: "#",
},
{
    id: 8,
    quote:
      "This was our third time booking through the platform and it never disappoints. The verified badge really does mean the listing matches reality.",
    client: {
      name: "Fatima Al-Rashid",
      role: "HR Manager, Crescent Holdings",
      avatar: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.7,
    property: {
      name: "Marina Bay Penthouse",
      location: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1760473537243-72168ffd273c?w=1200&q=80",
      beds: 4,
      baths: 4,
      sqft: 2600,
    },
    aiRecommended: true,
    detailsLink: "#",
},
{
    id: 9,
    quote:
      "Simple search filters made it easy to narrow down exactly what we wanted. Ended up finding a place better than what we usually get on other sites.",
    client: {
      name: "Ben Carter",
      role: "Freelance Photographer",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.6,
    property: {
      name: "Riverside Duplex",
      location: "Ho Chi Minh City, Vietnam",
      image: "https://images.unsplash.com/photo-1711995446053-ed618de00771?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
      beds: 2,
      baths: 2,
      sqft: 1150,
    },
    aiRecommended: false,
    detailsLink: "#",
},
{
    id: 10,
    quote:
      "Loved the transparency — safety score, location score, everything was laid out before we even messaged the host. Made the decision so much easier.",
    client: {
      name: "Grace Adeyemi",
      role: "Legal Counsel, Adeyemi & Co.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.9,
    property: {
      name: "Emerald Court Apartment",
      location: "Manila, Philippines",
      image: "https://images.unsplash.com/photo-1758908548763-4b5cd31d1b5a?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
      beds: 2,
      baths: 1,
      sqft: 1050,
    },
    aiRecommended: true,
    detailsLink: "#",
},
{
    id: 11,
    quote:
      "Communication was clear from start to finish. Only downside was the parking was a bit tight, but everything else more than made up for it.",
    client: {
      name: "Tomás Rivera",
      role: "Startup Founder, Vireo Labs",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
    },
    rating: 4.3,
    property: {
      name: "Lakeside Cottage",
      location: "Siem Reap, Cambodia",
      image: "https://images.unsplash.com/photo-1760473537243-72168ffd273c?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1200&q=80",
      beds: 1,
      baths: 1,
      sqft: 680,
    },
    aiRecommended: false,
    detailsLink: "#",
},
];
