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
  Testimonial
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
    type: "Villa",
    beds: 3,
    baths: 2,
    sqft: 1400,
    price: 160000,
    image: Property_1,
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
    name: "Cedar Heights Villa",
    location: "Gulshan, Dhaka",
    type: "Apartment",
    beds: 4,
    baths: 3,
    sqft: 2100,
    price: 245000,
    image: Property_2,
    badges: [
      {
        icon: "fi fi-ss-sparkles",
        tag: "AI Recommended",
      },
      {
        icon: "fi fi-ss-trophy-star",
        tag: "Best Choice",
      },
    ],
    overallScore: 87,
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
    id: "prop-3",
    name: "Maple Court Apartment",
    location: "Dhanmondi, Dhaka",
    type: "Apartment",
    beds: 2,
    baths: 2,
    sqft: 1050,
    price: 98000,
    image: Property_3,
    overallScore: 76,
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
    id: "prop-4",
    name: "Riverside Duplex",
    location: "Uttara, Dhaka",
    type: "Duplex",
    beds: 3,
    baths: 2,
    sqft: 1600,
    price: 175000,
    image: Property_4,
    badges: [
      {
        icon: "fi-ss-sparkles",
        tag: "AI Recommended",
      },
      {
        icon: "fi fi-ss-trophy-star",
        tag: "Best Choice",
      },
    ],
    overallScore: 84,
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
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    rating: 4.5,
    property: {
      name: "Skyline Villa",
      location: "Bangkok, Thailand",
      image: "https://picsum.photos/seed/skyline-villa/400/300",
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
      "The whole check-in process took less than five minutes. Staff was friendly and the apartment matched the photos exactly — no surprises at all.",
    client: {
      name: "Farhana Akter",
      role: "Marketing Lead, Nova Corp",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    rating: 5.0,
    property: {
      name: "Lakeview Residency",
      location: "Cox's Bazar, Bangladesh",
      image: "https://picsum.photos/seed/lakeview-residency/400/300",
      beds: 3,
      baths: 2,
      sqft: 1800,
    },
    aiRecommended: true,
    detailsLink: "#",
  },
  {
    id: 3,
    quote:
      "Great value for the price. The location was a bit far from downtown, but the free shuttle service made up for it completely.",
    client: {
      name: "Rakibul Islam",
      role: "Founder, Islam Traders",
      avatar: "https://i.pravatar.cc/150?img=51",
    },
    rating: 3.5,
    property: {
      name: "Palm Grove Apartments",
      location: "Dubai, UAE",
      image: "https://picsum.photos/seed/palm-grove/400/300",
      beds: 1,
      baths: 1,
      sqft: 850,
    },
    aiRecommended: false,
    detailsLink: "#",
  },
  {
    id: 4,
    quote:
      "Exceptional service from start to finish. Our host went above and beyond to make sure our stay was comfortable and memorable.",
    client: {
      name: "Nusrat Jahan",
      role: "Project Manager, Brightech",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
    rating: 5.0,
    property: {
      name: "Ocean Breeze Villa",
      location: "Bali, Indonesia",
      image: "https://picsum.photos/seed/ocean-breeze/400/300",
      beds: 4,
      baths: 3,
      sqft: 2200,
    },
    aiRecommended: true,
    detailsLink: "#",
  },
  {
    id: 5,
    quote:
      "Booking through the app was smooth, but the room was smaller than expected. Still a decent stay overall for the price we paid.",
    client: {
      name: "Tanvir Hasan",
      role: "Frontend Developer, PixelWorks",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    rating: 3.0,
    property: {
      name: "Urban Nest Studio",
      location: "Singapore",
      image: "https://picsum.photos/seed/urban-nest/400/300",
      beds: 1,
      baths: 1,
      sqft: 600,
    },
    aiRecommended: false,
    detailsLink: "#",
  },
  {
    id: 6,
    quote:
      "The car rental was ready ahead of schedule and the pricing was transparent with zero hidden fees. Would definitely book again.",
    client: {
      name: "Ayesha Rahman",
      role: "Product Designer, Studio One",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    rating: 4.0,
    property: {
      name: "Hilltop Cottage",
      location: "Chiang Mai, Thailand",
      image: "https://picsum.photos/seed/hilltop-cottage/400/300",
      beds: 2,
      baths: 1,
      sqft: 1100,
    },
    aiRecommended: true,
    detailsLink: "#",
  },
  {
    id: 7,
    quote:
      "Loved the interior design and how clean everything was. Only downside was the slow WiFi during our stay, but otherwise perfect.",
    client: {
      name: "Mahmudul Hasan",
      role: "CTO, Digital Nest",
      avatar: "https://i.pravatar.cc/150?img=60",
    },
    rating: 4.5,
    property: {
      name: "Emerald Heights",
      location: "Kuala Lumpur, Malaysia",
      image: "https://picsum.photos/seed/emerald-heights/400/300",
      beds: 3,
      baths: 2,
      sqft: 1650,
    },
    aiRecommended: true,
    detailsLink: "#",
  },
  {
    id: 8,
    quote:
      "Customer support responded within minutes when we had an issue with the key box. Really appreciated the quick resolution.",
    client: {
      name: "Sadia Islam",
      role: "HR Manager, Corex Ltd",
      avatar: "https://i.pravatar.cc/150?img=48",
    },
    rating: 4.0,
    property: {
      name: "Riverside Bungalow",
      location: "Phuket, Thailand",
      image: "https://picsum.photos/seed/riverside-bungalow/400/300",
      beds: 2,
      baths: 2,
      sqft: 1300,
    },
    aiRecommended: false,
    detailsLink: "#",
  },
  {
    id: 9,
    quote:
      "One of the best rental experiences we've had. The property exceeded expectations and the AI recommendation matched our needs perfectly.",
    client: {
      name: "Imran Chowdhury",
      role: "CEO, Chowdhury Group",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
    rating: 5.0,
    property: {
      name: "Sapphire Residences",
      location: "Maldives",
      image: "https://picsum.photos/seed/sapphire-residences/400/300",
      beds: 5,
      baths: 4,
      sqft: 3000,
    },
    aiRecommended: true,
    detailsLink: "#",
  },
  {
    id: 10,
    quote:
      "Decent stay overall. Check-out process was a little confusing at first, but the front desk helped us sort it out quickly.",
    client: {
      name: "Rezwana Karim",
      role: "Operations Lead, Karim & Co",
      avatar: "https://i.pravatar.cc/150?img=41",
    },
    rating: 3.5,
    property: {
      name: "Golden Sands Resort",
      location: "Goa, India",
      image: "https://picsum.photos/seed/golden-sands/400/300",
      beds: 2,
      baths: 2,
      sqft: 1500,
    },
    aiRecommended: false,
    detailsLink: "#",
  },
];
