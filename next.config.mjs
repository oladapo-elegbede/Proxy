/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/intake": ["./data/**/*"],
      "/api/pathway": ["./data/**/*"],
    },
  },
};

export default nextConfig;
