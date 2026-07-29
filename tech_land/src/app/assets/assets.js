import logo from "./logo.png";
import marketing from "./marketing.png";
import quotes from "./quotes.svg";
import heroBanner_1 from "./heroBanner_1.jpg";
import heroBanner_2 from "./heroBanner_2.jpg";
import heroBanner_3 from "./heroBanner_3.jpg";
import heroBanner_4 from "./heroBanner_4.jpg";
import heroBanner_5 from "./heroBanner_5.jpg";
import category1 from "./category1.jpg";
import category2 from "./category2.jpg";
import category3 from "./category3.jpg";
import category4 from "./category4.jpg";
import category5 from "./category5.jpg";
import category6 from "./category6.jpg";
import user_1 from "./user_1.jpg";
import user_2 from "./user_2.jpg";
import footerIcon_1 from "./footerIcon_1.png";
import footerIcon_2 from "./footerIcon_2.png";
import footerIcon_3 from "./footerIcon_3.png";
import footerIcon_4 from "./footerIcon_4.png";
import footerIcon_5 from "./footerIcon_5.png";
import feature_1 from "./feature_1.svg";
import feature_2 from "./feature_2.svg";
import feature_3 from "./feature_3.svg";
import feature_4 from "./feature_4.svg";

export const assets = {
  logo,
  marketing,
  quotes,
  user_1,
  user_2,
  footerIcon_1,
  footerIcon_2,
  footerIcon_3,
  footerIcon_4,
  footerIcon_5,
  feature_1,
  feature_2,
  feature_3,
  feature_4,
};

export const bannerImages = [
  heroBanner_1,
  heroBanner_2,
  heroBanner_3,
  heroBanner_4,
  heroBanner_5,
];

// export const categories = [
//   category1,
//   category2,
//   category3,
//   category4,
//   category5,
//   category6,
// ];

export const featureCardInfo = [
  {
    id: "fast-delivery",
    title: "Fast & Free Delivery",
    description:
      "Order today and have it at your doorstep within 24–48 hours, anywhere in the country. Every order ships free, no minimum spend required, and you can track it live from checkout to delivery.",
    image: feature_1,
  },
  {
    id: "secure-payment",
    title: "Secure Payment",
    description:
      "Every transaction is protected end-to-end with bank-grade SSL encryption and processed through trusted, PCI-compliant payment gateways, so your card details and personal info stay fully safe.",
    image: feature_2,
  },
  {
    id: "genuine-products",
    title: "100% Genuine Products",
    description:
      "Every product is sourced directly from authorized brand partners and manufacturers, never from third-party resellers. That means you always get full manufacturer warranty coverage and complete peace of mind.",
    image: feature_3,
  },
  {
    id: "support-247",
    title: "24/7 Customer Support",
    description:
      "Have a question or run into an issue? Our support team is available around the clock, every single day, ready to help over live chat, phone, or email until your problem is actually solved.",
    image: feature_4,
  },
];

export const contactInfo = [
  {
    icon: "fi fi-sr-phone-flip",
    contact: "+1 (415) 987-6543",
  },
  {
    icon: "fi fi-sr-marker",
    contact: "245 Market Street, San Francisco, CA 94105, USA.",
  },
  {
    icon: "fi fi-sr-envelope",
    contact: "support@speedwheels.com",
  },
];

// Sample FAQ data for a tech website — pass this directly into
// <FaqAccordion items={techFaqs} /> or map over it yourself.

export const Faqs = [
  {
    question: "What services does your company provide?",
    answer:
      "We build custom software solutions including web applications, mobile apps, cloud infrastructure, and API integrations. We also offer ongoing maintenance, technical consulting, and dedicated development teams for long-term projects.",
  },
  {
    question: "How long does it take to build a project?",
    answer:
      "Timelines depend on project scope, but most web applications take 6–12 weeks from planning to launch. We'll give you a detailed timeline after understanding your requirements during the initial consultation.",
  },
  {
    question: "Do you offer support after the project is delivered?",
    answer:
      "Yes. Every project includes 30 days of free post-launch support. After that, you can choose from our monthly maintenance plans covering bug fixes, updates, security patches, and performance monitoring.",
  },
  {
    question: "What technologies do you work with?",
    answer:
      "Our stack includes React, Next.js, Node.js, and Python on the backend, with PostgreSQL and MongoDB for databases. We deploy on AWS, Vercel, or your preferred cloud provider depending on project needs.",
  },
  {
    question: "Can you work with our existing codebase?",
    answer:
      "Absolutely. We regularly join ongoing projects to add features, fix bugs, refactor legacy code, or migrate outdated systems to modern frameworks without disrupting your current operations.",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a free discovery call through our website. We'll discuss your goals, review technical requirements, and send you a proposal with timeline and pricing within 2–3 business days.",
  },
];

// ---- Data ----
// Quick Links er প্রতিটি item এ label + link (href) key আছে
export const quickLinks = [
  { label: "Home", link: "/" },
  { label: "Shop", link: "/shop" },
  { label: "About Us", link: "/about" },
  { label: "Contact Us", link: "/contact" },
];

// Shop by Category er প্রতিটি item এও label + link key আছে
export const shopByCategory = [
  { label: "Home Decor", link: "/category/home-decor" },
  { label: "Kitchen Accessories", link: "/category/kitchen-accessories" },
  { label: "Small Home Appliances", link: "/category/small-home-appliances" },
  { label: "Lifestyle Products", link: "/category/lifestyle-products" },
];

// Contact info object আকারে — এখানে array না, কারণ প্রতিটি field আলাদা type এর
export const contactInformations = {
  address: "245 Market Street, San Francisco, CA 94105, USA.",
  phone: "+1 (415) 987-6543",
  email: "support@speedwheels.com",
};

// Social icons array of object — icon component + link
export const socialLinks = [
  { name: "Facebook", icon: footerIcon_1, link: "https://facebook.com" },
  { name: "Twitter", icon: footerIcon_2, link: "https://twitter.com" },
  { name: "Instagram", icon: footerIcon_3, link: "https://instagram.com" },
  { name: "Youtube", icon: footerIcon_4, link: "https://youtube.com" },
  { name: "Mail", icon: footerIcon_5, link: "mailto:support@speedwheels.com" },
];

// Bottom bar er legal links
export const legalLinks = [
  { label: "Terms", link: "/terms" },
  { label: "Privacy", link: "/privacy" },
  { label: "Cookies", link: "/cookies" },
];

export const products = [
  {
    id: 1,
    title: "NovaTech X15 Pro Gaming Laptop",
    category: "Laptop",
    brand: "Dell",
    tags: ["International Best Seller", "25% Discount"],
    rating: 4.5,
    reviewCount: 129,
    soldCount: "500+",
    description:
      "NovaTech X15 Pro একটি high-performance gaming laptop যা powerful processor, dedicated graphics এবং ultra-smooth display নিয়ে তৈরি — Gaming, streaming এবং heavy multitasking এর জন্য একদম ideal।",

    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    ],

    colors: [
      { id: "yellow", hex: "#F4C542" },
      { id: "red", hex: "#E14848" },
      { id: "blue", hex: "#3E6BF0" },
      { id: "green", hex: "#3EAE5A" },
      { id: "black", hex: "#1A1A1A" },
    ],

    ramOptions: [
      { id: "8gb", label: "8GB", extraPrice: 0 },
      { id: "64gb", label: "64GB", extraPrice: 1000 },
      { id: "16gb", label: "16GB", extraPrice: 0 },
    ],

    storageOptions: [
      { id: "128gb", label: "128GB", extraPrice: 0 },
      { id: "16gb", label: "16GB", extraPrice: 1000 },
      { id: "16gb-2", label: "16GB", extraPrice: 0 },
    ],

    processorOptions: [
      { id: "i5", label: "16GB", extraPrice: 0 },
      { id: "i7", label: "16GB", extraPrice: 1000 },
      { id: "i9", label: "16GB", extraPrice: 0 },
    ],

    price: 1299,
    originalPrice: 1399,
    quantity: 1,
    discountNote: "Save 15% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "GPU: NVIDIA RTX 4060 8GB",
      "Display: 15.6\" Full HD 165Hz",
      "Operating System: Windows 11",
      "Battery Life: Up to 8 Hours",
      "Weight: 2.1 kg",
      "Warranty: 1 Year",
      "RGB Backlit Keyboard",
      "Advanced Cooling System",
      "WiFi 6 Connectivity",
      "Thunderbolt 4 Support",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 129,
      breakdown: { 5: 88, 4: 20, 3: 12, 2: 5, 1: 4 },
      items: [
        {
          id: 1,
          name: "Mahdi",
          verified: true,
          location: "Dhaka, Bangladesh",
          rating: 4.5,
          date: "October 13, 2025",
          text: "Great product, would recommend! Great product, would recommended! Great product, would recommended! Great product, would recommended!",
          photos: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&q=80",
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=200&q=80",
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&q=80",
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&q=80",
          ],
        },
        {
          id: 2,
          name: "Mahdi",
          verified: true,
          location: "Dhaka, Bangladesh",
          rating: 4.5,
          date: "October 13, 2025",
          text: "Great product, would recommend! Great product, would recommended! Great product, would recommended! Great product, would recommended!",
          photos: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&q=80",
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=200&q=80",
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&q=80",
          ],
        },
        {
          id: 3,
          name: "Mahdi",
          verified: true,
          location: "Dhaka, Bangladesh",
          rating: 4.5,
          date: "October 13, 2025",
          text: "Great product, would recommend! Great product, would recommended! Great product, would recommended!",
          photos: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&q=80",
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=200&q=80",
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&q=80",
          ],
        },
      ],
    },
  },

  {
    id: 2,
    title: "Zenith S24 Ultra Smartphone",
    category: "Smartphone",
    brand: "Samsung",
    tags: ["New Arrival", "10% Discount"],
    rating: 4.7,
    reviewCount: 214,
    soldCount: "1.2k+",
    description:
      "Zenith S24 Ultra একটি flagship smartphone যেখানে আছে AI-powered camera, edge-to-edge AMOLED display এবং সারাদিনের ব্যাটারি ব্যাকআপ — power user দের জন্য একদম perfect।",

    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
    ],

    colors: [
      { id: "black", hex: "#1A1A1A" },
      { id: "blue", hex: "#3E6BF0" },
      { id: "silver", hex: "#C9CDD3" },
      { id: "gold", hex: "#D8B15D" },
    ],

    ramOptions: [
      { id: "8gb", label: "8GB", extraPrice: 0 },
      { id: "12gb", label: "12GB", extraPrice: 80 },
      { id: "16gb", label: "16GB", extraPrice: 160 },
    ],

    storageOptions: [
      { id: "128gb", label: "128GB", extraPrice: 0 },
      { id: "256gb", label: "256GB", extraPrice: 100 },
      { id: "512gb", label: "512GB", extraPrice: 220 },
    ],

    processorOptions: [
      { id: "snap8g2", label: "8 Gen 2", extraPrice: 0 },
      { id: "snap8g3", label: "8 Gen 3", extraPrice: 120 },
      { id: "dimensity", label: "Dimensity 9300", extraPrice: 90 },
    ],

    price: 899,
    originalPrice: 999,
    quantity: 1,
    discountNote: "Save 10% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "Display: 6.8\" QHD+ AMOLED 120Hz",
      "Camera: 200MP Main + 50MP Ultra-wide",
      "Battery: 5000mAh, 65W Fast Charging",
      "Operating System: Android 15",
      "Water Resistance: IP68",
      "Warranty: 1 Year",
      "5G Connectivity",
      "In-display Fingerprint Sensor",
      "Wireless Charging Support",
      "Stereo Speakers",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 214,
      breakdown: { 5: 150, 4: 40, 3: 15, 2: 6, 1: 3 },
      items: [
        {
          id: 1,
          name: "Rafi",
          verified: true,
          location: "Chittagong, Bangladesh",
          rating: 5,
          date: "November 2, 2025",
          text: "Camera quality is amazing! Battery also lasts the whole day easily.",
          photos: [
            "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&q=80",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
          ],
        },
        {
          id: 2,
          name: "Nadia",
          verified: true,
          location: "Dhaka, Bangladesh",
          rating: 4.5,
          date: "October 28, 2025",
          text: "Great phone, smooth performance, but a bit heavy to hold for long.",
          photos: [
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&q=80",
          ],
        },
      ],
    },
  },

  {
    id: 3,
    title: "AeroTab 11 Pro Tablet",
    category: "Tablet",
    brand: "Apple",
    tags: ["Best Seller", "15% Discount"],
    rating: 4.4,
    reviewCount: 96,
    soldCount: "700+",
    description:
      "AeroTab 11 Pro হালকা, powerful এবং versatile — drawing, note-taking, streaming বা multitasking, সব কাজেই সমান comfortable একটি tablet।",

    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    ],

    colors: [
      { id: "silver", hex: "#C9CDD3" },
      { id: "black", hex: "#1A1A1A" },
      { id: "blue", hex: "#3E6BF0" },
    ],

    ramOptions: [
      { id: "6gb", label: "6GB", extraPrice: 0 },
      { id: "8gb", label: "8GB", extraPrice: 40 },
      { id: "12gb", label: "12GB", extraPrice: 90 },
    ],

    storageOptions: [
      { id: "128gb", label: "128GB", extraPrice: 0 },
      { id: "256gb", label: "256GB", extraPrice: 70 },
      { id: "512gb", label: "512GB", extraPrice: 150 },
    ],

    processorOptions: [
      { id: "a15", label: "Chip A15", extraPrice: 0 },
      { id: "a17", label: "Chip A17", extraPrice: 100 },
      { id: "snap", label: "Snapdragon 8cx", extraPrice: 80 },
    ],

    price: 549,
    originalPrice: 649,
    quantity: 1,
    discountNote: "Save 15% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "Display: 11\" Liquid Retina 120Hz",
      "Battery: Up to 12 Hours",
      "Operating System: TabOS 6",
      "Weight: 460g",
      "Stylus Support",
      "Warranty: 1 Year",
      "Quad Speaker Setup",
      "Face Unlock",
      "WiFi 6 + Optional 5G",
      "USB-C Fast Charging",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 96,
      breakdown: { 5: 60, 4: 22, 3: 9, 2: 3, 1: 2 },
      items: [
        {
          id: 1,
          name: "Tanvir",
          verified: true,
          location: "Sylhet, Bangladesh",
          rating: 4.5,
          date: "September 18, 2025",
          text: "Perfect for note-taking and sketching. Screen is very bright and sharp.",
          photos: [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200&q=80",
          ],
        },
      ],
    },
  },

  {
    id: 4,
    title: "LumaShot X Mirrorless Camera",
    category: "Camera",
    brand: "Canon",
    tags: ["Editor's Choice", "20% Discount"],
    rating: 4.8,
    reviewCount: 178,
    soldCount: "350+",
    description:
      "LumaShot X একটি professional-grade mirrorless camera যেখানে আছে 24MP full-frame sensor এবং 4K video recording — photography এবং videography দুই ক্ষেত্রেই দুর্দান্ত performance।",

    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
      "https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=800&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    ],

    colors: [
      { id: "black", hex: "#1A1A1A" },
      { id: "silver", hex: "#C9CDD3" },
    ],

    ramOptions: [
      { id: "body-only", label: "Body Only", extraPrice: 0 },
      { id: "kit-lens", label: "With Kit Lens", extraPrice: 200 },
      { id: "dual-lens", label: "Dual Lens Kit", extraPrice: 450 },
    ],

    storageOptions: [
      { id: "no-card", label: "No Card", extraPrice: 0 },
      { id: "64gb", label: "64GB Card", extraPrice: 25 },
      { id: "128gb", label: "128GB Card", extraPrice: 45 },
    ],

    processorOptions: [
      { id: "standard", label: "Standard Processor", extraPrice: 0 },
      { id: "pro", label: "Pro Image Engine", extraPrice: 150 },
      { id: "pro-max", label: "Pro Max Engine", extraPrice: 280 },
    ],

    price: 1499,
    originalPrice: 1799,
    quantity: 1,
    discountNote: "Save 20% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "Sensor: 24MP Full-Frame CMOS",
      "Video: 4K 60fps Recording",
      "ISO Range: 100–51200",
      "Weight: 650g (Body Only)",
      "Warranty: 2 Years",
      "In-body Image Stabilization",
      "Weather-sealed Body",
      "Dual SD Card Slots",
      "Wi-Fi & Bluetooth Transfer",
      "3\" Tilting Touchscreen",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 178,
      breakdown: { 5: 140, 4: 25, 3: 8, 2: 3, 1: 2 },
      items: [
        {
          id: 1,
          name: "Farhan",
          verified: true,
          location: "Dhaka, Bangladesh",
          rating: 5,
          date: "August 30, 2025",
          text: "Image quality is stunning, especially in low light. Build quality feels premium too.",
          photos: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80",
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&q=80",
          ],
        },
      ],
    },
  },

  {
    id: 5,
    title: "SonicWave Pro Headphones",
    category: "Headphone",
    brand: "Sony",
    tags: ["Top Rated", "18% Discount"],
    rating: 4.6,
    reviewCount: 312,
    soldCount: "2k+",
    description:
      "SonicWave Pro headphones এ আছে active noise cancellation, 40-hour battery life এবং studio-quality sound — music lovers এবং travelers এর জন্য perfect companion।",

    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    ],

    colors: [
      { id: "black", hex: "#1A1A1A" },
      { id: "white", hex: "#F2F2F2" },
      { id: "blue", hex: "#3E6BF0" },
    ],

    ramOptions: [
      { id: "standard", label: "Standard", extraPrice: 0 },
      { id: "anc", label: "ANC Edition", extraPrice: 30 },
      { id: "hifi", label: "Hi-Fi Edition", extraPrice: 60 },
    ],

    storageOptions: [
      { id: "no-case", label: "No Case", extraPrice: 0 },
      { id: "travel-case", label: "Travel Case", extraPrice: 20 },
      { id: "hard-case", label: "Hard Case", extraPrice: 35 },
    ],

    processorOptions: [
      { id: "bt5", label: "Bluetooth 5.0", extraPrice: 0 },
      { id: "bt53", label: "Bluetooth 5.3", extraPrice: 15 },
      { id: "ldac", label: "LDAC Codec", extraPrice: 25 },
    ],

    price: 179,
    originalPrice: 219,
    quantity: 1,
    discountNote: "Save 18% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "Driver: 40mm Dynamic Driver",
      "Battery: Up to 40 Hours (ANC On)",
      "Noise Cancellation: Active (ANC)",
      "Weight: 260g",
      "Warranty: 1 Year",
      "Foldable Design",
      "Multi-device Pairing",
      "Built-in Microphone",
      "Quick Charge: 10min = 5hr",
      "Touch Controls",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 312,
      breakdown: { 5: 220, 4: 60, 3: 20, 2: 8, 1: 4 },
      items: [
        {
          id: 1,
          name: "Sadia",
          verified: true,
          location: "Dhaka, Bangladesh",
          rating: 5,
          date: "November 10, 2025",
          text: "Noise cancellation is excellent, perfect for long flights and daily commute.",
          photos: [
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&q=80",
          ],
        },
      ],
    },
  },

  {
    id: 6,
    title: "PulseFit GT Smartwatch",
    category: "Smartwatch",
    brand: "Samsung",
    tags: ["Trending", "12% Discount"],
    rating: 4.3,
    reviewCount: 158,
    soldCount: "900+",
    description:
      "PulseFit GT একটি all-round smartwatch যেখানে আছে heart rate monitoring, GPS tracking এবং 10 দিনের ব্যাটারি ব্যাকআপ — fitness enthusiasts দের জন্য নির্ভরযোগ্য সঙ্গী।",

    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    ],

    colors: [
      { id: "black", hex: "#1A1A1A" },
      { id: "silver", hex: "#C9CDD3" },
      { id: "rose-gold", hex: "#D8A99A" },
    ],

    ramOptions: [
      { id: "40mm", label: "40mm Case", extraPrice: 0 },
      { id: "44mm", label: "44mm Case", extraPrice: 20 },
      { id: "48mm", label: "48mm Case", extraPrice: 40 },
    ],

    storageOptions: [
      { id: "sport-band", label: "Sport Band", extraPrice: 0 },
      { id: "leather-band", label: "Leather Band", extraPrice: 25 },
      { id: "metal-band", label: "Metal Band", extraPrice: 45 },
    ],

    processorOptions: [
      { id: "standard", label: "Standard GPS", extraPrice: 0 },
      { id: "cellular", label: "GPS + Cellular", extraPrice: 100 },
      { id: "pro", label: "Pro Chip", extraPrice: 60 },
    ],

    price: 249,
    originalPrice: 289,
    quantity: 1,
    discountNote: "Save 12% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "Display: 1.9\" AMOLED Always-On",
      "Battery: Up to 10 Days",
      "Water Resistance: 5 ATM",
      "Sensors: Heart Rate, SpO2, GPS",
      "Warranty: 1 Year",
      "100+ Sport Modes",
      "Sleep Tracking",
      "Bluetooth Calling",
      "Smart Notifications",
      "Compatible with iOS & Android",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 158,
      breakdown: { 5: 95, 4: 40, 3: 15, 2: 5, 1: 3 },
      items: [
        {
          id: 1,
          name: "Imran",
          verified: true,
          location: "Rajshahi, Bangladesh",
          rating: 4,
          date: "October 5, 2025",
          text: "Battery life is impressive, easily lasts a week. GPS accuracy could be a bit better.",
          photos: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
          ],
        },
      ],
    },
  },

  {
    id: 7,
    title: "AirBeat Pro Wireless Earbuds",
    category: "Earbuds",
    brand: "Apple",
    tags: ["Hot Deal", "22% Discount"],
    rating: 4.5,
    reviewCount: 267,
    soldCount: "1.5k+",
    description:
      "AirBeat Pro earbuds এ আছে active noise cancellation, sweat resistance এবং crystal clear sound quality — workout এবং daily use দুই ক্ষেত্রেই একদম মানানসই।",

    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=800&q=80",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    ],

    colors: [
      { id: "white", hex: "#F2F2F2" },
      { id: "black", hex: "#1A1A1A" },
    ],

    ramOptions: [
      { id: "standard", label: "Standard", extraPrice: 0 },
      { id: "anc", label: "ANC Edition", extraPrice: 25 },
      { id: "pro", label: "Pro Edition", extraPrice: 45 },
    ],

    storageOptions: [
      { id: "wired-case", label: "Wired Case", extraPrice: 0 },
      { id: "wireless-case", label: "Wireless Charging Case", extraPrice: 20 },
      { id: "extended-case", label: "Extended Battery Case", extraPrice: 35 },
    ],

    processorOptions: [
      { id: "bt5", label: "Bluetooth 5.0", extraPrice: 0 },
      { id: "bt53", label: "Bluetooth 5.3", extraPrice: 10 },
      { id: "aptx", label: "aptX Adaptive", extraPrice: 20 },
    ],

    price: 99,
    originalPrice: 129,
    quantity: 1,
    discountNote: "Save 22% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "Driver: 11mm Dynamic Driver",
      "Battery: 8hr (Earbuds) + 24hr (Case)",
      "Noise Cancellation: Active (ANC)",
      "Water Resistance: IPX5",
      "Warranty: 1 Year",
      "Touch Controls",
      "Low Latency Gaming Mode",
      "Voice Assistant Support",
      "Wireless Charging Case",
      "In-ear Detection",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 267,
      breakdown: { 5: 190, 4: 50, 3: 18, 2: 6, 1: 3 },
      items: [
        {
          id: 1,
          name: "Priya",
          verified: true,
          location: "Dhaka, Bangladesh",
          rating: 4.5,
          date: "November 15, 2025",
          text: "Sound quality is really good for the price. Fits comfortably even during workouts.",
          photos: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80",
          ],
        },
      ],
    },
  },

  {
    id: 8,
    title: "ViewMax 32 4K UHD Monitor",
    category: "Monitor",
    brand: "LG",
    tags: ["Staff Pick", "16% Discount"],
    rating: 4.6,
    reviewCount: 143,
    soldCount: "420+",
    description:
      "ViewMax 32 একটি 4K UHD monitor যেখানে আছে HDR support এবং 144Hz refresh rate — gaming, editing এবং professional কাজের জন্য একদম নিখুঁত display।",

    images: [
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80",
    ],

    colors: [
      { id: "black", hex: "#1A1A1A" },
      { id: "white", hex: "#F2F2F2" },
    ],

    ramOptions: [
      { id: "27inch", label: "27\"", extraPrice: 0 },
      { id: "32inch", label: "32\"", extraPrice: 80 },
      { id: "34inch-curved", label: "34\" Curved", extraPrice: 150 },
    ],

    storageOptions: [
      { id: "hd", label: "1080p Panel", extraPrice: 0 },
      { id: "4k", label: "4K UHD Panel", extraPrice: 100 },
      { id: "5k", label: "5K Panel", extraPrice: 220 },
    ],

    processorOptions: [
      { id: "60hz", label: "60Hz", extraPrice: 0 },
      { id: "144hz", label: "144Hz", extraPrice: 60 },
      { id: "165hz", label: "165Hz", extraPrice: 90 },
    ],

    price: 399,
    originalPrice: 479,
    quantity: 1,
    discountNote: "Save 16% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "Panel: 32\" 4K UHD IPS",
      "Refresh Rate: 144Hz",
      "Response Time: 1ms",
      "HDR: HDR400 Support",
      "Warranty: 2 Years",
      "Ports: HDMI 2.1, DisplayPort, USB-C",
      "Adjustable Stand (Height/Tilt)",
      "Built-in Speakers",
      "Flicker-free Technology",
      "VESA Mount Compatible",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 143,
      breakdown: { 5: 100, 4: 30, 3: 9, 2: 3, 1: 1 },
      items: [
        {
          id: 1,
          name: "Kamal",
          verified: true,
          location: "Khulna, Bangladesh",
          rating: 5,
          date: "September 22, 2025",
          text: "Colors are vivid and the 144Hz refresh rate makes gaming so much smoother.",
          photos: [
            "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=200&q=80",
          ],
        },
      ],
    },
  },

  {
    id: 9,
    title: "Cascade RGB Mechanical Keyboard",
    category: "Keyboard",
    brand: "Logitech",
    tags: ["Popular", "14% Discount"],
    rating: 4.4,
    reviewCount: 189,
    soldCount: "800+",
    description:
      "Cascade RGB mechanical keyboard এ আছে hot-swappable switches, per-key RGB lighting এবং durable aluminum body — gamers এবং typists উভয়ের জন্যই উপযুক্ত।",

    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-79d0c1a5e6ea?w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    ],

    colors: [
      { id: "black", hex: "#1A1A1A" },
      { id: "white", hex: "#F2F2F2" },
      { id: "gray", hex: "#8A8F98" },
    ],

    ramOptions: [
      { id: "red-switch", label: "Red Switch", extraPrice: 0 },
      { id: "brown-switch", label: "Brown Switch", extraPrice: 10 },
      { id: "blue-switch", label: "Blue Switch", extraPrice: 10 },
    ],

    storageOptions: [
      { id: "tkl", label: "Tenkeyless", extraPrice: 0 },
      { id: "full-size", label: "Full Size", extraPrice: 15 },
      { id: "60percent", label: "60% Compact", extraPrice: -10 },
    ],

    processorOptions: [
      { id: "wired", label: "Wired", extraPrice: 0 },
      { id: "wireless", label: "Wireless 2.4G", extraPrice: 25 },
      { id: "bluetooth", label: "Bluetooth Multi-pairing", extraPrice: 35 },
    ],

    price: 79,
    originalPrice: 92,
    quantity: 1,
    discountNote: "Save 14% - Free shipping",
    cancelNote: "Cancel Anytime - no fees",

    specifications: [
      "Switch Type: Hot-swappable Mechanical",
      "Backlight: Per-key RGB",
      "Body: Aluminum Top Plate",
      "Connectivity: Wired / 2.4G / Bluetooth",
      "Warranty: 1 Year",
      "N-Key Rollover",
      "Detachable USB-C Cable",
      "Programmable Macro Keys",
      "Adjustable Kickstand",
      "Compatible with Windows & Mac",
    ],

    guarantees: [
      { icon: "shield-check", title: "3rd-party tested", subtitle: "for heavy materials" },
      { icon: "refresh", title: "60-days guarantee", subtitle: "for heavy materials" },
      { icon: "package", title: "15-days replacement", subtitle: "for heavy materials" },
    ],

    reviews: {
      total: 189,
      breakdown: { 5: 130, 4: 40, 3: 12, 2: 5, 1: 2 },
      items: [
        {
          id: 1,
          name: "Shakil",
          verified: true,
          location: "Dhaka, Bangladesh",
          rating: 4.5,
          date: "October 20, 2025",
          text: "Typing feel is fantastic, and the RGB lighting looks premium. Great value for money.",
          photos: [
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=80",
          ],
        },
      ],
    },
  },
];
