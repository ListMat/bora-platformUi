/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bora/ui", "@bora/api", "@bora/db", "@bora/auth"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  webpack: (config, { isServer }) => {
    // Fix for Prisma Client resolution
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '.prisma/client/default': require.resolve('@prisma/client'),
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;

