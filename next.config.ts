import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: false },
      { source: "/practice", destination: "/", permanent: false },
      { source: "/contact", destination: "/#inquiry", permanent: false },
      { source: "/en/about", destination: "/en", permanent: false },
      { source: "/en/practice", destination: "/en", permanent: false },
      { source: "/en/contact", destination: "/en#inquiry", permanent: false },
    ];
  },
};

export default nextConfig;
