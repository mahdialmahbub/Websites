// next.config.mjs

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forward API requests to the Express backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },

  // Enable React Compiler
  reactCompiler: true,

  // Allow remote images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
