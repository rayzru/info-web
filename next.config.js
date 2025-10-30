/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable server-side features and API routes
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig
