/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React 19 features
  reactStrictMode: true,

  // Turbopack configuration
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
