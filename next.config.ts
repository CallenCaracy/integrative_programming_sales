import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
            },
        ],
    },
};

export default nextConfig;
