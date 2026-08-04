import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires every `quality` value used anywhere to be whitelisted here.
    // 85 is the site-wide quality (see IMAGE_QUALITY in components/media.tsx); 75 is
    // kept as a safe fallback so an image left on next/image's default never 400s.
    qualities: [75, 85],
  },
};

export default nextConfig;
