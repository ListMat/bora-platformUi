/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@bora/db"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;
