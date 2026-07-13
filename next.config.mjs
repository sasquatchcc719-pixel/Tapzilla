/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // native binary — must stay out of the webpack bundle
    serverComponentsExternalPackages: ["@resvg/resvg-js"],
  },
  async redirects() {
    // v1 marketing routes retired in the smart-card relaunch
    return [
      { source: "/how-it-works", destination: "/", permanent: true },
      { source: "/channels", destination: "/", permanent: true },
      { source: "/channels/:path*", destination: "/", permanent: true },
      { source: "/industries", destination: "/", permanent: true },
      { source: "/industries/:path*", destination: "/", permanent: true },
      { source: "/onboarding", destination: "/build", permanent: true },
    ];
  },
};

export default nextConfig;
