/** @type {import('next').NextConfig} */
const nextConfig = {
  formats: ["image/avif", "image/webp"],
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
